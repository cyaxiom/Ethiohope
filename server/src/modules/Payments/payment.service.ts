import { EnrollmentModel } from '@modules/Enrollments/enrollment.model';
import { ChildModel } from '@modules/Child/child.model'; // Ensure Child model is registered
import stripe from '@utils/stripe';
import { CLIENT_URL } from '@config/env';
import { logger } from '@utils/logger';
import { HttpException } from '@common/errors/HttpException';
import { Types } from 'mongoose';

export class PaymentService {
  public async createCheckoutSession(enrollmentIds: string[], userId: string): Promise<{ url: string | null }> {
    // 1. Fetch enrollments with relations
    const enrollments = await EnrollmentModel.find({
      _id: { $in: enrollmentIds },
    })
      .populate('child')
      .populate('program')
      .populate('phase')
      .lean();

    if (enrollments.length === 0) {
      throw new HttpException(404, 'No enrollments found');
    }

    // 2. Validate
    const lineItems = enrollments.map(enrollment => {
      const e = enrollment as any;
      
      // Basic validation
      if (e.status !== 'PENDING') {
        throw new HttpException(400, `Enrollment for ${e.program.title} is not PENDING`);
      }
      if (e.parent.toString() !== userId) {
        throw new HttpException(403, 'Unauthorized access to enrollment');
      }

      // 3. Build Stripe line items
      const childName = e.child?.firstname || e.child?.firstName || 'Student';
      const childLast = e.child?.lastname || e.child?.lastName || '';
      const fullName = `${childName} ${childLast}`.trim();

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${fullName} - ${e.program?.title} - ${e.phase?.title}`,
          },
          unit_amount: Math.round((e.phase.price || 0) * 100), // Total is the phase price (tax inclusive)
        },
        quantity: 1,
      };
    });

    // 4. Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: `${CLIENT_URL}payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}payment/cancel`,
      metadata: {
        enrollmentIds: JSON.stringify(enrollmentIds),
        userId: userId,
      },
    });

    return { url: session.url };
  }

  public async updatePaymentStatus(sessionId: string, status: string): Promise<void> {
    logger.info(`[PaymentService] Updating payment status for session ${sessionId} to ${status}`);
    // You can track session reference in a Payment schema if needed.
  }

  public async activateEnrollments(metadata: any, transactionId?: string): Promise<void> {
    logger.info(`[PaymentService] Activating enrollments with metadata: ${JSON.stringify(metadata)}, transactionId: ${transactionId}`);
    try {
      if (!metadata || !metadata.enrollmentIds) return;

      const enrollmentIds = JSON.parse(metadata.enrollmentIds);

      // Find enrollments and populate to get related IDs
      const enrollments = await EnrollmentModel.find({ _id: { $in: enrollmentIds } });

      if (enrollments.length === 0) return;

      const parentId = metadata.userId || enrollments[0].parent;
      const parent = await import('@modules/User/user.schema').then(m => m.User.findById(parentId).lean());

      for (const enrollment of enrollments) {
        // Skip if already activated to prevent regenerating credentials
        if (enrollment.status === 'ACTIVE') continue;

        // Update enrollment status
        enrollment.status = 'ACTIVE';
        enrollment.paymentStatus = 'PAID';
        if (transactionId) enrollment.transactionId = transactionId;
        await enrollment.save();

        // Add to chat groups
        try {
          const chatService = new (await import('@modules/Chat/chat.service')).ChatService();
          // Add to batch-specific discussion groups
          await chatService.addStudentToBatchGroup(enrollment.batch.toString(), enrollment.child.toString());
          
          // Also ensure they are added to the general program announcement group
          const programGroup = await chatService.ensureProgramGroupExists(enrollment.program.toString());
          if (programGroup) {
            await chatService.syncProgramGroupMembers(programGroup._id, enrollment.program.toString());
          }
        } catch (err) {
          logger.error(`[PaymentService] Failed to sync chat groups for enrollment ${enrollment._id}: ${err}`);
        }

        // Step 1: Cancel any other duplicate pending enrollments for the same child and phase
        const otherPending = await EnrollmentModel.updateMany(
          {
            _id: { $ne: enrollment._id },
            child: enrollment.child,
            phase: enrollment.phase,
            status: 'PENDING',
            paymentStatus: 'UNPAID'
          },
          { status: 'CANCELLED' }
        );
        logger.info(`[PaymentService] Cancelled ${otherPending.modifiedCount} duplicate pending enrollments for child ${enrollment.child}`);

        // Step 2: Generate Child Credentials (if needed)
        const ChildModel = (await import('@modules/Child/child.model')).ChildModel;
        const child = await ChildModel.findById(enrollment.child);

        if (child && parent && parent.email) {
          // Only generate credentials and send email if it's a NEW child
          if (!enrollment.isExistingChild) {
            const rawPin = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit pin
            const bcrypt = await import('bcryptjs');
            const hashedPin = await bcrypt.hash(rawPin, 10);
            
            child.pin = hashedPin;
            await child.save();

            // Step 2: Email parent asynchronously 
            const emailService = (await import('@infra/mail/email.service')).emailService;
            emailService.sendChildCredentialsEmail(
              parent.email, 
              child.firstname || 'Student', 
              child.username, 
              rawPin
            ).catch(err => {
              logger.error(`[PaymentService] Failed to send credentials email to ${parent.email}: ${err}`);
            });
          } else {
            logger.info(`[PaymentService] Skipping credentials for existing child ${child.username}`);
          }
        }
      }

      logger.info(`[PaymentService] ${enrollments.length} Enrollments activated and credentials processed.`);
    } catch (error) {
       logger.error(`[PaymentService] Failed to activate enrollments: ${error}`);
    }
  }

  public async assignBatchToStudent(): Promise<void> {
    logger.info(`[PaymentService] Assigning batch to student`);
    // TODO: Implement batch assignment logic
  }

  public async generateChildCredentials(): Promise<void> {
    logger.info(`[PaymentService] Generating child credentials`);
    // TODO: Implement credential generation logic
  }

  public async getParentPayments(userId: string, search?: string, status?: string): Promise<{ payments: any[], totalSpent: number }> {
    const query: any = { parent: userId };

    const totalSpentResult = await EnrollmentModel.aggregate([
      { $match: { parent: new Types.ObjectId(userId), paymentStatus: 'PAID' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalSpent = totalSpentResult.length > 0 ? totalSpentResult[0].total : 0;

    if (status) {
      if (status === 'PAID') query.paymentStatus = 'PAID';
      else if (status === 'UNPAID') query.paymentStatus = 'UNPAID';
      
      if (status === 'ACTIVE') query.status = 'ACTIVE';
      else if (status === 'PENDING') query.status = 'PENDING';
      else if (status === 'CANCELLED') query.status = 'CANCELLED';
    }

    let enrollments = await EnrollmentModel.find(query)
      .populate('child', 'firstname lastname username')
      .populate('program', 'title description image')
      .populate('phase', 'title orderIndex price')
      .sort({ createdAt: -1 })
      .lean();

    if (search) {
      const searchLower = search.toLowerCase();
      enrollments = enrollments.filter((e: any) => 
        e.child?.firstname?.toLowerCase().includes(searchLower) ||
        e.child?.lastname?.toLowerCase().includes(searchLower) ||
        e.program?.title?.toLowerCase().includes(searchLower) ||
        e.phase?.title?.toLowerCase().includes(searchLower)
      );
    }

    return {
      payments: enrollments,
      totalSpent
    };
  }

  public async getAllPayments(search?: string, status?: string): Promise<any[]> {
    const query: any = {};

    if (status) {
      if (status === 'PAID') query.paymentStatus = 'PAID';
      else if (status === 'UNPAID') query.paymentStatus = 'UNPAID';
      
      if (status === 'ACTIVE') query.status = 'ACTIVE';
      else if (status === 'PENDING') query.status = 'PENDING';
      else if (status === 'CANCELLED') query.status = 'CANCELLED';
    }

    const enrollments = await EnrollmentModel.find(query)
      .populate('parent', 'firstname lastname email phone')
      .populate('child', 'firstname lastname username')
      .populate('program', 'title description image')
      .populate('phase', 'title orderIndex price')
      .sort({ createdAt: -1 })
      .lean();

    if (search) {
      const searchLower = search.toLowerCase();
      return enrollments.filter((e: any) => 
        e.child?.firstname?.toLowerCase().includes(searchLower) ||
        e.child?.lastname?.toLowerCase().includes(searchLower) ||
        e.parent?.firstname?.toLowerCase().includes(searchLower) ||
        e.parent?.lastname?.toLowerCase().includes(searchLower) ||
        e.parent?.email?.toLowerCase().includes(searchLower) ||
        e.program?.title?.toLowerCase().includes(searchLower) ||
        e.phase?.title?.toLowerCase().includes(searchLower)
      );
    }

    return enrollments;
  }

  public async confirmPaymentSession(sessionId: string): Promise<any> {
    logger.info(`[PaymentService] Manually confirming session ${sessionId}`);
    
    // 1. Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      logger.info(`[PaymentService] Session ${sessionId} is paid. Activating enrollments...`);
      
      // 2. Activate enrollments if not already done
      if (session.metadata) {
        await this.activateEnrollments(session.metadata, session.id);
      }
      
      return { success: true, status: 'paid' };
    }
    
    return { success: true, status: session.payment_status };
  }
}

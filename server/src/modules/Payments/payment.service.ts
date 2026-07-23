import { EnrollmentModel } from '@modules/Enrollments/enrollment.model';
import { ChildModel } from '@modules/Child/child.model'; // Ensure Child model is registered
import stripe from '@utils/stripe';
import { CLIENT_URL, COMPANY_EMAIL, SENDER_MAIL } from '@config/env';
import { logger } from '@utils/logger';
import { HttpException } from '@common/errors/HttpException';
import { Types } from 'mongoose';
import { emailService } from '@infra/mail/email.service';
import { User } from '@modules/User/user.schema';
import { RoleModel } from '@modules/AccessControl/role.model';

export class PaymentService {
  public async createCheckoutSession(enrollmentIds: string[], userId: string): Promise<{ url: string | null }> {
    const enrollments = await EnrollmentModel.find({
      _id: { $in: enrollmentIds },
    })
      .populate('child')
      .populate('user', 'firstname lastname email')
      .populate('program')
      .populate('phase')
      .populate('package')
      .lean();

    if (enrollments.length === 0) {
      throw new HttpException(404, 'No enrollments found');
    }

    const hasMonthly = enrollments.some((e: any) => e.billingType === 'MONTHLY' || e.package);
    const hasOneTime = enrollments.some((e: any) => e.billingType !== 'MONTHLY' && !e.package);
    if (hasMonthly && hasOneTime) {
      throw new HttpException(
        400,
        'Please checkout tutoring packages separately from one-time course enrollments'
      );
    }

    const lineItems = enrollments.map((enrollment) => {
      const e = enrollment as any;

      if (e.status !== 'PENDING') {
        throw new HttpException(400, `Enrollment for ${e.program?.title || 'program'} is not PENDING`);
      }
      if (e.parent.toString() !== userId) {
        throw new HttpException(403, 'Unauthorized access to enrollment');
      }

      let fullName = 'Student';
      if (e.enrolleeType === 'SELF' || e.user) {
        const u = e.user;
        fullName = `${u?.firstname || ''} ${u?.lastname || ''}`.trim() || u?.email || 'You';
      } else {
        const childName = e.child?.firstname || e.child?.firstName || 'Student';
        const childLast = e.child?.lastname || e.child?.lastName || '';
        fullName = `${childName} ${childLast}`.trim();
      }

      const packageLabel = e.package
        ? `${e.package.name || `${e.package.daysPerWeek}x / week`} (monthly)`
        : e.phase?.title || 'Enrollment';
      const amount = e.amount ?? e.package?.price ?? e.phase?.price ?? 0;

      const priceData: any = {
        currency: 'usd',
        product_data: {
          name: `${fullName} - ${e.program?.title} - ${packageLabel}`,
        },
        unit_amount: Math.round(amount * 100),
      };

      if (hasMonthly) {
        priceData.recurring = { interval: 'month' };
      }

      return {
        price_data: priceData,
        quantity: 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: hasMonthly ? 'subscription' : 'payment',
      line_items: lineItems,
      success_url: `${CLIENT_URL}payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}payment/cancel`,
      metadata: {
        enrollmentIds: JSON.stringify(enrollmentIds),
        userId: userId,
        billingType: hasMonthly ? 'MONTHLY' : 'ONE_TIME',
      },
    });

    return { url: session.url };
  }

  /**
   * User reports they sent a Zelle transfer for selected pending enrollments.
   * Marks enrollments for admin review and emails admins.
   */
  public async reportZellePayment(
    enrollmentIds: string[],
    userId: string
  ): Promise<{ success: boolean; message: string; count: number }> {
    const enrollments = await EnrollmentModel.find({
      _id: { $in: enrollmentIds },
      parent: userId,
      status: 'PENDING',
      paymentStatus: 'UNPAID',
    })
      .populate('child', 'firstname lastname')
      .populate('user', 'firstname lastname email')
      .populate('program', 'title')
      .populate('phase', 'title price')
      .populate('parent', 'firstname lastname email phone');

    if (enrollments.length === 0) {
      throw new HttpException(404, 'No pending unpaid enrollments found for this payment');
    }

    if (enrollments.length !== enrollmentIds.length) {
      throw new HttpException(400, 'Some selected enrollments are invalid or already paid');
    }

    const now = new Date();
    await EnrollmentModel.updateMany(
      { _id: { $in: enrollments.map((e) => e._id) } },
      {
        $set: {
          paymentMethod: 'ZELLE',
          zelleSubmittedAt: now,
        },
      }
    );

    const parent = enrollments[0].parent as any;
    const payerName =
      `${parent?.firstname || ''} ${parent?.lastname || ''}`.trim() || parent?.email || 'Unknown payer';
    const payerEmail = parent?.email || '';
    const payerPhone = parent?.phone;

    const enrollmentRows = enrollments.map((enrollment: any) => {
      let learnerName = 'Student';
      if (enrollment.enrolleeType === 'SELF' || enrollment.user) {
        const u = enrollment.user;
        learnerName = `${u?.firstname || ''} ${u?.lastname || ''}`.trim() || u?.email || 'You';
      } else {
        learnerName =
          `${enrollment.child?.firstname || ''} ${enrollment.child?.lastname || ''}`.trim() || 'Child';
      }

      return {
        learnerName,
        programTitle: enrollment.program?.title || 'Program',
        phaseTitle: enrollment.phase?.title || 'Phase',
        amount: enrollment.amount || enrollment.phase?.price || 0,
      };
    });

    const totalAmount = enrollmentRows.reduce((sum, row) => sum + row.amount, 0);

    const adminEmails = new Set<string>();
    if (COMPANY_EMAIL) adminEmails.add(COMPANY_EMAIL);
    if (SENDER_MAIL) adminEmails.add(SENDER_MAIL);

    try {
      const adminRoles = await RoleModel.find({
        code: { $in: ['super_admin', 'admin'] },
      })
        .select('_id')
        .lean();
      const roleIds = adminRoles.map((r) => r._id);
      if (roleIds.length > 0) {
        const admins = await User.find({ roles: { $in: roleIds }, status: 'active' })
          .select('email')
          .lean();
        admins.forEach((a: any) => {
          if (a.email) adminEmails.add(a.email);
        });
      }
    } catch (err) {
      logger.warn(`[PaymentService] Could not resolve admin users for Zelle notice: ${err}`);
    }

    if (adminEmails.size === 0) {
      logger.error('[PaymentService] No admin email configured for Zelle notification');
    } else {
      const adminUrl = `${(CLIENT_URL || '').replace(/\/$/, '')}/admin/payments`;
      try {
        await emailService.sendZellePaymentSubmittedEmail(Array.from(adminEmails), {
          payerName,
          payerEmail,
          payerPhone,
          totalAmount,
          enrollments: enrollmentRows,
          adminUrl,
        });
      } catch (err) {
        logger.error(`[PaymentService] Failed to send Zelle admin email: ${err}`);
        // Still succeed for the user — enrollments are flagged in DB for admin review
      }
    }

    logger.info(
      `[PaymentService] Zelle payment reported by ${userId} for ${enrollments.length} enrollment(s)`
    );

    return {
      success: true,
      message: 'Zelle payment reported. An admin will verify and activate your enrollment shortly.',
      count: enrollments.length,
    };
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
        if (metadata.stripeSubscriptionId) {
          enrollment.stripeSubscriptionId = metadata.stripeSubscriptionId;
        }
        await enrollment.save();

        // Add to chat groups (batch-based programs only)
        try {
          const chatService = new (await import('@modules/Chat/chat.service')).ChatService();
          if (enrollment.batch) {
            if (enrollment.enrolleeType === 'SELF' && enrollment.user) {
              await chatService.addAdultStudentToBatchGroup(enrollment.batch.toString(), enrollment.user.toString());
            } else if (enrollment.child) {
              await chatService.addStudentToBatchGroup(enrollment.batch.toString(), enrollment.child.toString());
            }
          }

          const programGroup = await chatService.ensureProgramGroupExists(enrollment.program.toString());
          if (programGroup) {
            await chatService.syncProgramGroupMembers(programGroup._id, enrollment.program.toString());
          }
        } catch (err) {
          logger.error(`[PaymentService] Failed to sync chat groups for enrollment ${enrollment._id}: ${err}`);
        }

        // Cancel duplicate pending enrollments for same learner + phase/package
        const duplicateFilter: any = {
          _id: { $ne: enrollment._id },
          status: 'PENDING',
          paymentStatus: 'UNPAID',
        };
        if (enrollment.package) {
          duplicateFilter.package = enrollment.package;
        } else if (enrollment.phase) {
          duplicateFilter.phase = enrollment.phase;
        }
        if (enrollment.enrolleeType === 'SELF' && enrollment.user) {
          duplicateFilter.user = enrollment.user;
        } else if (enrollment.child) {
          duplicateFilter.child = enrollment.child;
        }

        const otherPending = await EnrollmentModel.updateMany(duplicateFilter, { status: 'CANCELLED' });
        logger.info(`[PaymentService] Cancelled ${otherPending.modifiedCount} duplicate pending enrollments`);

        // Child credentials only for CHILD enrollments
        if (enrollment.enrolleeType !== 'SELF' && enrollment.child) {
          const ChildModel = (await import('@modules/Child/child.model')).ChildModel;
          const child = await ChildModel.findById(enrollment.child);

          if (child && parent && parent.email) {
            if (!enrollment.isExistingChild) {
              const rawPin = Math.floor(100000 + Math.random() * 900000).toString();
              const bcrypt = await import('bcryptjs');
              const hashedPin = await bcrypt.hash(rawPin, 10);

              child.pin = hashedPin;
              await child.save();

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
      .populate('user', 'firstname lastname email')
      .populate('program', 'title description image')
      .populate('phase', 'title orderIndex price')
      .sort({ createdAt: -1 })
      .lean();

    if (search) {
      const searchLower = search.toLowerCase();
      enrollments = enrollments.filter((e: any) =>
        e.child?.firstname?.toLowerCase().includes(searchLower) ||
        e.child?.lastname?.toLowerCase().includes(searchLower) ||
        e.user?.firstname?.toLowerCase().includes(searchLower) ||
        e.user?.lastname?.toLowerCase().includes(searchLower) ||
        e.user?.email?.toLowerCase().includes(searchLower) ||
        e.program?.title?.toLowerCase().includes(searchLower) ||
        e.phase?.title?.toLowerCase().includes(searchLower)
      );
    }

    return {
      payments: enrollments,
      totalSpent
    };
  }

  public async getAllPayments(
    search?: string,
    status?: string,
    programId?: string,
    enrolleeType?: string
  ): Promise<{ applications: any[]; summary: Record<string, number> }> {
    const query: any = {};

    if (status) {
      if (status === 'PAID') query.paymentStatus = 'PAID';
      else if (status === 'UNPAID') query.paymentStatus = 'UNPAID';
      else if (status === 'ACTIVE') query.status = 'ACTIVE';
      else if (status === 'PENDING') query.status = 'PENDING';
      else if (status === 'CANCELLED') query.status = 'CANCELLED';
      else if (status === 'ZELLE') {
        query.paymentMethod = 'ZELLE';
        query.paymentStatus = 'UNPAID';
        query.status = 'PENDING';
        query.zelleSubmittedAt = { $exists: true, $ne: null };
      }
    }

    if (programId) {
      query.program = programId;
    }

    if (enrolleeType === 'SELF' || enrolleeType === 'CHILD') {
      query.enrolleeType = enrolleeType;
    }

    let enrollments = await EnrollmentModel.find(query)
      .populate('parent', 'firstname lastname email phone')
      .populate('child', 'firstname lastname username')
      .populate('user', 'firstname lastname email phone')
      .populate('program', 'title description image isForChildren programType')
      .populate('phase', 'title orderIndex price')
      .populate('package', 'name price daysPerWeek')
      .populate('batch', 'batchName')
      .sort({ createdAt: -1 })
      .lean();

    if (search) {
      const searchLower = search.toLowerCase();
      enrollments = enrollments.filter((e: any) =>
        e.child?.firstname?.toLowerCase().includes(searchLower) ||
        e.child?.lastname?.toLowerCase().includes(searchLower) ||
        e.child?.username?.toLowerCase().includes(searchLower) ||
        e.user?.firstname?.toLowerCase().includes(searchLower) ||
        e.user?.lastname?.toLowerCase().includes(searchLower) ||
        e.user?.email?.toLowerCase().includes(searchLower) ||
        e.parent?.firstname?.toLowerCase().includes(searchLower) ||
        e.parent?.lastname?.toLowerCase().includes(searchLower) ||
        e.parent?.email?.toLowerCase().includes(searchLower) ||
        e.program?.title?.toLowerCase().includes(searchLower) ||
        e.phase?.title?.toLowerCase().includes(searchLower) ||
        e.batch?.batchName?.toLowerCase().includes(searchLower)
      );
    }

    // Summary across filtered results
    const summary = {
      total: enrollments.length,
      pending: enrollments.filter((e: any) => e.status === 'PENDING').length,
      paid: enrollments.filter((e: any) => e.paymentStatus === 'PAID').length,
      unpaid: enrollments.filter((e: any) => e.paymentStatus === 'UNPAID' && e.status !== 'CANCELLED').length,
      cancelled: enrollments.filter((e: any) => e.status === 'CANCELLED').length,
      zellePending: enrollments.filter(
        (e: any) => e.paymentMethod === 'ZELLE' && e.zelleSubmittedAt && e.paymentStatus === 'UNPAID' && e.status === 'PENDING'
      ).length,
      self: enrollments.filter((e: any) => e.enrolleeType === 'SELF' || (!e.child && e.user)).length,
      child: enrollments.filter((e: any) => e.enrolleeType === 'CHILD' || !!e.child).length,
      revenue: enrollments
        .filter((e: any) => e.paymentStatus === 'PAID')
        .reduce((sum: number, e: any) => sum + (e.amount || e.phase?.price || 0), 0),
    };

    return { applications: enrollments, summary };
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

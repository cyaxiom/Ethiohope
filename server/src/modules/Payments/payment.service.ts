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

        // Child credentials are issued at registration — do not regenerate on payment
      }

      logger.info(`[PaymentService] ${enrollments.length} Enrollments activated.`);
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
      .populate('program', 'title description image programType')
      .populate('phase', 'title orderIndex price')
      .populate('package', 'name price daysPerWeek')
      .sort({ createdAt: -1 })
      .lean();

    enrollments = await this.backfillSubscriptionPeriodEnds(enrollments);

    if (search) {
      const searchLower = search.toLowerCase();
      enrollments = enrollments.filter((e: any) =>
        e.child?.firstname?.toLowerCase().includes(searchLower) ||
        e.child?.lastname?.toLowerCase().includes(searchLower) ||
        e.user?.firstname?.toLowerCase().includes(searchLower) ||
        e.user?.lastname?.toLowerCase().includes(searchLower) ||
        e.user?.email?.toLowerCase().includes(searchLower) ||
        e.program?.title?.toLowerCase().includes(searchLower) ||
        e.phase?.title?.toLowerCase().includes(searchLower) ||
        e.package?.name?.toLowerCase().includes(searchLower)
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

    enrollments = await this.backfillSubscriptionPeriodEnds(enrollments);

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

  /**
   * For cancel-at-period-end enrollments missing a stored end date,
   * fetch once from Stripe and persist so the UI can show it on the card.
   */
  private async backfillSubscriptionPeriodEnds(enrollments: any[]): Promise<any[]> {
    const needsBackfill = enrollments.filter(
      (e) =>
        e.subscriptionCancelAtPeriodEnd &&
        e.status === 'ACTIVE' &&
        e.stripeSubscriptionId &&
        !e.subscriptionCurrentPeriodEnd
    );

    if (needsBackfill.length === 0) return enrollments;

    await Promise.all(
      needsBackfill.map(async (e) => {
        try {
          const sub = await stripe.subscriptions.retrieve(e.stripeSubscriptionId);
          const endTs = (sub as any).current_period_end as number | undefined;
          if (!endTs) return;
          const periodEnd = new Date(endTs * 1000);
          e.subscriptionCurrentPeriodEnd = periodEnd;
          await EnrollmentModel.updateOne(
            { _id: e._id },
            { $set: { subscriptionCurrentPeriodEnd: periodEnd } }
          );
        } catch (err: any) {
          logger.warn(
            `[PaymentService] Could not backfill period end for ${e._id}: ${err?.message || err}`
          );
        }
      })
    );

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

  /**
   * Cancel a monthly tutoring Stripe subscription.
   * Stops future charges at period end (student keeps access until then).
   */
  public async cancelSubscription(
    enrollmentId: string,
    actorUserId: string,
    canceledBy: 'PARENT' | 'ADMIN'
  ): Promise<{ success: boolean; message: string; enrollment: any }> {
    const enrollment = await EnrollmentModel.findById(enrollmentId)
      .populate('program', 'title programType')
      .populate('package', 'name price daysPerWeek')
      .populate('child', 'firstname lastname')
      .populate('user', 'firstname lastname email');

    if (!enrollment) {
      throw new HttpException(404, 'Enrollment not found');
    }

    if (canceledBy === 'PARENT' && enrollment.parent.toString() !== actorUserId) {
      throw new HttpException(403, 'You can only manage your own subscriptions');
    }

    const isMonthly = enrollment.billingType === 'MONTHLY' || !!enrollment.package;
    if (!isMonthly) {
      throw new HttpException(400, 'This enrollment is not a monthly subscription');
    }

    if (enrollment.status === 'CANCELLED') {
      throw new HttpException(400, 'This enrollment is already cancelled');
    }

    if (enrollment.subscriptionCancelAtPeriodEnd) {
      throw new HttpException(400, 'Subscription cancellation is already scheduled');
    }

    if (enrollment.status !== 'ACTIVE' || enrollment.paymentStatus !== 'PAID') {
      throw new HttpException(400, 'Only active paid tutoring subscriptions can be cancelled');
    }

    let periodEnd: Date | null = null;

    if (enrollment.stripeSubscriptionId) {
      try {
        const sub = await stripe.subscriptions.update(enrollment.stripeSubscriptionId, {
          cancel_at_period_end: true,
        });
        const endTs = (sub as any).current_period_end as number | undefined;
        periodEnd = endTs ? new Date(endTs * 1000) : null;
        logger.info(
          `[PaymentService] Stripe subscription ${enrollment.stripeSubscriptionId} set to cancel at period end`
        );
      } catch (err: any) {
        logger.error(`[PaymentService] Stripe cancel failed: ${err.message}`);
        // If already canceled on Stripe, continue local update
        if (err?.code !== 'resource_missing' && err?.statusCode !== 404) {
          throw new HttpException(400, err?.message || 'Failed to cancel Stripe subscription');
        }
      }
    } else {
      // No Stripe subscription (e.g. Zelle) — stop access immediately
      enrollment.status = 'CANCELLED';
    }

    enrollment.subscriptionCancelAtPeriodEnd = true;
    enrollment.subscriptionCanceledAt = new Date();
    enrollment.subscriptionCanceledBy = canceledBy;
    if (periodEnd) {
      enrollment.subscriptionCurrentPeriodEnd = periodEnd;
    }
    await enrollment.save();

    const when = enrollment.stripeSubscriptionId
      ? periodEnd
        ? ` Billing stops after ${periodEnd.toLocaleDateString()}. Access continues until then.`
        : ' No further monthly charges after the current billing period.'
      : ' Enrollment has been cancelled and will not renew.';

    return {
      success: true,
      message: enrollment.stripeSubscriptionId
        ? `Monthly subscription will end at the close of the current billing period.${when}`
        : `Tutoring enrollment cancelled.${when}`,
      enrollment,
    };
  }

  /**
   * Resume a monthly tutoring subscription that was set to cancel at period end.
   */
  public async resumeSubscription(
    enrollmentId: string,
    actorUserId: string,
    resumedBy: 'PARENT' | 'ADMIN'
  ): Promise<{ success: boolean; message: string; enrollment: any }> {
    const enrollment = await EnrollmentModel.findById(enrollmentId)
      .populate('program', 'title programType')
      .populate('package', 'name price daysPerWeek');

    if (!enrollment) {
      throw new HttpException(404, 'Enrollment not found');
    }

    if (resumedBy === 'PARENT' && enrollment.parent.toString() !== actorUserId) {
      throw new HttpException(403, 'You can only manage your own subscriptions');
    }

    const isMonthly = enrollment.billingType === 'MONTHLY' || !!enrollment.package;
    if (!isMonthly) {
      throw new HttpException(400, 'This enrollment is not a monthly subscription');
    }

    if (enrollment.status === 'CANCELLED') {
      throw new HttpException(
        400,
        'This subscription has already ended. Start a new enrollment to bill again.'
      );
    }

    if (!enrollment.subscriptionCancelAtPeriodEnd) {
      throw new HttpException(400, 'This subscription is already set to renew');
    }

    if (!enrollment.stripeSubscriptionId) {
      throw new HttpException(
        400,
        'This enrollment has no Stripe subscription to resume. Contact support if you need help.'
      );
    }

    try {
      await stripe.subscriptions.update(enrollment.stripeSubscriptionId, {
        cancel_at_period_end: false,
      });
      logger.info(
        `[PaymentService] Stripe subscription ${enrollment.stripeSubscriptionId} resumed by ${resumedBy}`
      );
    } catch (err: any) {
      logger.error(`[PaymentService] Stripe resume failed: ${err.message}`);
      throw new HttpException(400, err?.message || 'Failed to resume Stripe subscription');
    }

    enrollment.subscriptionCancelAtPeriodEnd = false;
    enrollment.subscriptionCanceledAt = undefined;
    enrollment.subscriptionCanceledBy = undefined;
    enrollment.subscriptionCurrentPeriodEnd = undefined;
    await enrollment.save();

    return {
      success: true,
      message: 'Monthly billing has been resumed. Charges will continue as usual.',
      enrollment,
    };
  }

  /** Finalize enrollment when Stripe subscription actually ends */
  public async handleSubscriptionEnded(subscriptionId: string): Promise<void> {
    const enrollment = await EnrollmentModel.findOne({ stripeSubscriptionId: subscriptionId });
    if (!enrollment) {
      logger.info(`[PaymentService] No enrollment for ended subscription ${subscriptionId}`);
      return;
    }

    if (enrollment.status === 'CANCELLED') return;

    enrollment.status = 'CANCELLED';
    enrollment.subscriptionCancelAtPeriodEnd = false;
    if (!enrollment.subscriptionCanceledAt) {
      enrollment.subscriptionCanceledAt = new Date();
    }
    await enrollment.save();
    logger.info(`[PaymentService] Enrollment ${enrollment._id} cancelled after subscription ended`);
  }
}

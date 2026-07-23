import { Request, Response, NextFunction } from 'express';
import stripe from '@utils/stripe';
import { PaymentService } from './payment.service';
import { STRIPE_WEBHOOK_SECRET } from '@config/env';
import { logger } from '@utils/logger';
import Stripe from 'stripe';
import { EnrollmentModel } from '@modules/Enrollments/enrollment.model';

import { RequestWithTokenPayload } from '@modules/Authentication/auth.interface';

export class PaymentController {
  public paymentService = new PaymentService();

  public createCheckoutSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { enrollmentIds } = req.body;
      const userPayload = (req as RequestWithTokenPayload).tokenPayload;
      const userId = userPayload?._id;

      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }

      if (!enrollmentIds || !Array.isArray(enrollmentIds) || enrollmentIds.length === 0) {
        res.status(400).json({ message: 'enrollmentIds are required' });
        return;
      }

      const result = await this.paymentService.createCheckoutSession(enrollmentIds, userId.toString());
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public handleWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const sig = req.headers['stripe-signature'] as string;
    let event: any;

    try {
      if (!STRIPE_WEBHOOK_SECRET) {
        throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
      }

      // Stripe requires the raw body for signature verification
      event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
      console.log("Webhook received", event.type);
    } catch (err: any) {
      logger.error(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object as any;

          console.log("Payment successful", session.id);

          // Extract session data and update DB
          await this.paymentService.updatePaymentStatus(session.id, "SUCCESS");

          if (session.metadata) {
            await this.paymentService.activateEnrollments(session.metadata, session.id);
          }

          await this.paymentService.assignBatchToStudent();
          await this.paymentService.generateChildCredentials();

          break;

        default:
          logger.info(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      next(error);
    }
  };

  public getParentPayments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userPayload = (req as RequestWithTokenPayload).tokenPayload;
      const userId = userPayload?._id;
      const { search, status } = req.query;

      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' });
        return;
      }

      const payments = await this.paymentService.getParentPayments(
        userId.toString(),
        search as string,
        status as string
      );

      res.status(200).json({
        success: true,
        data: payments
      });
    } catch (error) {
      next(error);
    }
  };

  public getAllPayments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { search, status, programId, enrolleeType } = req.query;

      const result = await this.paymentService.getAllPayments(
        search as string,
        status as string,
        programId as string,
        enrolleeType as string
      );

      res.status(200).json({
        success: true,
        data: result.applications,
        summary: result.summary,
      });
    } catch (error) {
      next(error);
    }
  };

  public updatePaymentStatusManually = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { enrollmentId, status } = req.body;

      if (!enrollmentId || !status) {
        res.status(400).json({ success: false, message: 'enrollmentId and status are required' });
        return;
      }

      const enrollment = await EnrollmentModel.findById(enrollmentId);
      if (!enrollment) {
        res.status(404).json({ success: false, message: 'Enrollment not found' });
        return;
      }

      if (status === 'ACTIVE') {
        enrollment.status = 'ACTIVE';
        enrollment.paymentStatus = 'PAID';
        await enrollment.save();

        // Trigger post-activation logic (credentials, etc.)
        await this.paymentService.activateEnrollments({ enrollmentIds: JSON.stringify([enrollmentId]) });
      } else if (status === 'CANCELLED') {
        enrollment.status = 'CANCELLED';
        await enrollment.save();
      } else {
        enrollment.status = status;
        await enrollment.save();
      }

      res.status(200).json({
        success: true,
        message: `Payment status updated to ${status}`
      });
    } catch (error) {
      next(error);
    }
  };

  public confirmPaymentSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { sessionId } = req.params;

      if (!sessionId) {
        res.status(400).json({ success: false, message: 'sessionId is required' });
        return;
      }

      const result = await this.paymentService.confirmPaymentSession(sessionId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public reportZellePayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { enrollmentIds } = req.body;
      const userPayload = (req as RequestWithTokenPayload).tokenPayload;
      const userId = userPayload?._id;

      if (!userId) {
        res.status(401).json({ success: false, message: 'User not authenticated' });
        return;
      }

      if (!enrollmentIds || !Array.isArray(enrollmentIds) || enrollmentIds.length === 0) {
        res.status(400).json({ success: false, message: 'enrollmentIds are required' });
        return;
      }

      const result = await this.paymentService.reportZellePayment(enrollmentIds, userId.toString());
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

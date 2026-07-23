import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { Routes } from '@common/interfaces/route.interface';
import { webhookRawMiddleware } from '@middlewares/webhookRaw';
import { authMiddleware, requirePermission } from '@common/middlewares/auth.middleware';

export class PaymentRoute implements Routes {
  public path = '/payments';
  public router = Router();
  public paymentController = new PaymentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Create Checkout Session
    this.router.post('/create-checkout-session', authMiddleware as any, this.paymentController.createCheckoutSession as any);

    // Get parent payments history
    this.router.get('/parent-history', authMiddleware as any, this.paymentController.getParentPayments as any);

    // Get all payments (Admin)
    this.router.get('/admin/all', authMiddleware as any, requirePermission('payment.read') as any, this.paymentController.getAllPayments as any);

    // Update payment status manually (Admin)
    this.router.patch('/admin/update-status', authMiddleware as any, requirePermission('payment.update') as any, this.paymentController.updatePaymentStatusManually as any);
    
    // Confirm payment session
    this.router.get('/confirm/:sessionId', authMiddleware as any, this.paymentController.confirmPaymentSession as any);

    // User reports Zelle transfer sent (notifies admins)
    this.router.post('/zelle-submitted', authMiddleware as any, this.paymentController.reportZellePayment as any);

    // Webhook route - needs raw body for Stripe signature verification
    this.router.post('/webhook', webhookRawMiddleware, this.paymentController.handleWebhook as any);
  }
}

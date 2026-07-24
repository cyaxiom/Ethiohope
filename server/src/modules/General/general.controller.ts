import { Request, Response } from "express";
import { asyncHandler } from "@common/utils/asyncHandler";
import HttpStatusCodes from "@common/utils/HttpStatusCodes";
import { emailService } from "@infra/mail/email.service";
import { SENDER_MAIL } from "@config/env";
import { logger } from "@utils/logger";

export class GeneralController {
  /**
   * Handle Contact Form Submission
   */
  public submitContactForm = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Please provide all required fields (name, email, message)."
      });
    }

    logger.info(`GeneralController: New contact form submission from ${email}`);

    try {
        // Send email to the system support address
        await emailService.sendContactFormEmail(SENDER_MAIL as string, {
            name,
            email,
            message
        });

        res.status(HttpStatusCodes.OK).json({
            success: true,
            message: "Thank you for contacting us! We have received your message and will get back to you shortly."
        });
    } catch (err) {
        logger.error("GeneralController: Failed to send contact form email:", err);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to send message. Please try again later or contact us directly."
        });
    }
  });
}

import { HttpResponse } from '@/core/common/interfaces/HttpResponse';
import { logger } from '@utils/logger';
import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';

const modelsErrorMiddleware = (
  error: Error.ValidationError,
  req: Request,
  res: Response<HttpResponse<object | null>>,
  next: NextFunction
) => {
  try {
    if (error instanceof Error.ValidationError) {
      let message = '';
      Object.values(error.errors).forEach(err => {
        message += `${err.message}, `;
      });
      message = message.slice(0, -2); // remove trailing ", "

      logger.error(`[${req.method}] ${req.path} >> StatusCode:: 400, Message:: ${message}`);

      res.status(400).json({
        data: null,  // ✅ allowed because type is now object | null
        message,
        success: false,
      });
    } else {
      next(error);
    }
  } catch (err) {
    next(err);
  }
};

export default modelsErrorMiddleware;

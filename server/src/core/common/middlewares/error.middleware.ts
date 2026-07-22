import { HttpException } from '@errors/HttpException';
import { HttpResponse } from '@/core/common/interfaces/HttpResponse';
import { logger } from '@utils/logger';
import { NextFunction, Request, Response } from 'express';
import { NODE_ENV } from '@config/env';

const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response<HttpResponse<null>>,
  _next: NextFunction
) => {
  const status: number = error.status || 500;
  const message: string = error.message || 'Internal Server Error';

  logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);

  res.status(status).json({
    success: false,
    message,
    data: null,
    ...(NODE_ENV === 'development' && {
      stack: error.stack,
    }),
  });
};

export default errorMiddleware;
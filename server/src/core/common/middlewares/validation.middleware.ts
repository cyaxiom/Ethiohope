import { HttpException } from '@errors/HttpException';
import { logger } from '@utils/logger';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';

type RequestProperty = 'body' | 'query' | 'params';

const validationMiddleware = (
  type: any,
  value: RequestProperty = 'body',
  skipMissingProperties = true,
  whitelist = false,
  forbidNonWhitelisted = true,
): RequestHandler => {
  return (req, res, next) => {
    logger.info('validationMiddleware');

    validate(plainToInstance(type, req[value]), {
      forbidNonWhitelisted,
      skipMissingProperties,
      whitelist,
    }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const extractErrors = (errorList: ValidationError[]): string[] => {
          return errorList.flatMap(error => {
            const constraints = error.constraints ? Object.values(error.constraints) : [];
            const childErrors = error.children && error.children.length > 0 ? extractErrors(error.children) : [];
            return [...constraints, ...childErrors];
          });
        };

        const message = extractErrors(errors).join(', ');

        logger.error(`Validation failed: ${message || 'Unknown validation error'}`);
        next(new HttpException(400, message || 'Validation failed'));
      } else {
        next();
      }
    });
  };
};

export default validationMiddleware;

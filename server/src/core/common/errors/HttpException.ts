import HttpStatusCodes from '@utils/HttpStatusCodes';
export class HttpException extends Error {
  public status: HttpStatusCodes;
  public isOperational = true;

  constructor(status: HttpStatusCodes, message: string) {
    super(message);
    this.status = status;

    Error.captureStackTrace(this, this.constructor);
  }
}
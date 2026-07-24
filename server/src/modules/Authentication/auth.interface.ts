import { ITokenPayload } from '@common/Token/token.interface';
import { IUser } from '@modules/User/user.interface';
import { Request } from 'express';

export interface RequestWithTokenPayload extends Request {
  tokenPayload: ITokenPayload;
}

export interface RequestWithTokenPayloadAndUser extends RequestWithTokenPayload {
  user: IUser;
}

export interface ICookie {
  name: string;
  options: {
    httpOnly: boolean;
    maxAge: number;
    sameSite?: boolean | 'lax' | 'strict' | 'none' | undefined;
    secure?: boolean;
  };
  value: string;
}

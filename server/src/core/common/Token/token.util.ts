import { HttpException } from '@common/errors/HttpException';
import HttpStatusCodes from '@common/utils/HttpStatusCodes';
import { sign, verify } from 'jsonwebtoken';
import UserToken from '@/core/common/Token/token.schema';
import { type ITokenPayload, ITokenService } from '@common/Token/token.interface';
import { ACCESS_TOKEN_PRIVATE_KEY, REFRESH_TOKEN_PRIVATE_KEY } from '@config/env';
import { User } from '@modules/User/user.schema';

export const generateTokens = async (tokenPayload: ITokenPayload): Promise<ITokenService> => {
  try {
    const accessToken = sign(tokenPayload, ACCESS_TOKEN_PRIVATE_KEY as string, { expiresIn: '1d' });
    const refreshToken = sign(tokenPayload, REFRESH_TOKEN_PRIVATE_KEY as string, { expiresIn: '7d' });

    const userToken = await UserToken.findOne({ userId: tokenPayload._id });

    if (userToken) await userToken.deleteOne();
    
    // save refresh token into the Database
    await new UserToken({ token: refreshToken, userId: tokenPayload._id }).save();
    return { accessToken, refreshToken };
  } catch (err) {
    throw new HttpException(HttpStatusCodes.INTERNAL_SERVER_ERROR, 'Cannot generate token');
  }
};

export const verifyRefreshToken = async (refreshToken: string): Promise<string> => {
  try {
    const privateKey = REFRESH_TOKEN_PRIVATE_KEY as string;

    // Check if refresh token exists in UserToken collection
    const userToken = await UserToken.findOne({ token: refreshToken });
    if (!userToken) {
      throw new HttpException(HttpStatusCodes.UNAUTHORIZED, 'Invalid or expired refresh token');
    }

    // Verify the JWT token
    const tokenDetails = verify(refreshToken, privateKey) as ITokenPayload;

    // Find user by ID
    const user = await User.findById(tokenDetails._id);
    if (!user) {
      throw new HttpException(HttpStatusCodes.UNAUTHORIZED, 'User no longer exists');
    }

    // Generate new access token
    const accessToken = sign(
      {
        _id: user._id,
        role: user.roles,
        type: tokenDetails.type
      },
      ACCESS_TOKEN_PRIVATE_KEY as string,
      { expiresIn: '1d' },
    );

    return accessToken;
  } catch (error) {
    if (error instanceof HttpException) throw error;
    throw new HttpException(HttpStatusCodes.UNAUTHORIZED, 'Invalid refresh token');
  }
};
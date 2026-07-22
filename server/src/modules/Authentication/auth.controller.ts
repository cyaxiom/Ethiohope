import { Request, Response, NextFunction } from "express";
import { asyncHandler } from '@common/utils/asyncHandler';
import { HttpResponse } from '@/core/common/interfaces/HttpResponse';
import HttpStatusCodes from '@common/utils/HttpStatusCodes';
import { AuthService } from "@auth/auth.service";
import { HttpException } from "@common/errors/HttpException";
import { UserDTO, UserLoginDTO } from '@modules/User/user.dto';
import { IUser } from '@modules/User/user.interface';
import { Types } from 'mongoose';
import { type RequestWithTokenPayload } from '@modules/Authentication/auth.interface';
import { verifyRefreshToken } from '@common/Token/token.util';
import { logger } from "@utils/logger";

export class AuthController {
  private authService = new AuthService();

  // @desc Register user
  // @route POST /signup
  // @access Public
  public signup = asyncHandler(async (req: Request, res: Response) => {
    const userData: UserDTO = req.body;
    const signUpUserData: IUser = await this.authService.signup(userData);

    const { cookie, updatedUser, accessToken, roleCodes, permissions, redirectRoute, firstLogin } = await this.authService.login({
      identifier: userData.email,
      password: userData.password
    } as any);

    res.cookie(cookie.name, cookie.value, cookie.options);

    res.status(HttpStatusCodes.CREATED).json({
      success: true,
      message: 'Account created and logged in successfully!',
      data: {
        firstLogin,
        token: accessToken,
        user: updatedUser,
        roles: roleCodes,
        permissions,
        redirectTo: redirectRoute
      },
    });
  });

  // @desc login
  // @route POST /login
  // @access Public
  public logIn = asyncHandler(async (
    req: Request,
    res: Response<
      HttpResponse<{
        firstLogin: boolean;
        token: string;
        user: IUser;
        roles: string[];
        permissions: string[];
        redirectTo: string;
      }>
    >,
  ) => {
    const userData: UserLoginDTO = req.body;
    const { cookie, updatedUser, accessToken, roleCodes, permissions, redirectRoute, firstLogin } = await this.authService.login(userData);

    res.cookie(cookie.name, cookie.value, cookie.options);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: 'User logged in successfully',
      data: {
        firstLogin,
        token: accessToken,
        user: updatedUser,
        roles: roleCodes,
        permissions,
        redirectTo: redirectRoute
      },
    });
  });

  // @desc logout
  // @route POST /auth/logout
  // @access Private
  public logOut = asyncHandler(async (req: Request, res: Response) => {
    const { tokenPayload } = req as RequestWithTokenPayload;

    if (tokenPayload) {
      logger.info(`User ${tokenPayload._id} attempting logout`);
      await this.authService.logout(tokenPayload);
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: false, // i will Set true in  production
    });

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: 'Logged out successfully',
    });
  });

  // @desc Refresh
  // @route GET /auth/refresh
  // @access Public - because acess token has expired
  public refresh = asyncHandler(async (req: Request, res: Response) => {
    const { cookies } = req;

    const refreshToken = cookies.refreshToken;
    if (!refreshToken) {
      logger.warn('Refresh attempt failed: No refresh token provided in cookies');
      throw new HttpException(HttpStatusCodes.UNAUTHORIZED, "No refresh token provided");
    }

    logger.info('Verifying refresh token...');
    const accessToken = await verifyRefreshToken(refreshToken);
    logger.info('Token successfully refreshed');

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: 'Access token refreshed successfully',
      data: { accessToken },
    });
  });

  // @desc forget password
  // @route POST /auth/forget
  // @access Public
  public forgetPassword = asyncHandler(async (req: Request, res: Response<HttpResponse<null>>): Promise<void> => {
    const { email } = req.body;
    await this.authService.forgotPassword(email);

    res.status(HttpStatusCodes.OK).json({
      data: null,
      message: 'If a user with that email exists, a reset link has been sent.',
      success: true
    });
  });

  // @desc reset password
  // @route POST /auth/reset
  // @access Public
  public resetPassword = asyncHandler(async (req: Request, res: Response<HttpResponse<null>>): Promise<void> => {
    const { token, password } = req.body;
    await this.authService.resetPassword(token, password);

    res.status(HttpStatusCodes.OK).json({
      data: null,
      message: 'Password has been reset successfully.',
      success: true
    });
  });

  // @desc verify email
  // @route POST /auth/verify
  // @access Public
  // @desc send verification email
  // @route POST /auth/verify
  // @access Public
  public sendVerificationEmail = asyncHandler(async (req: Request, res: Response<HttpResponse<null>>): Promise<void> => {
    const { email } = req.body;
    await this.authService.sendVerificationEmail(email);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: 'Verification email sent successfully',
      data: null
    });
  });

  // @desc confirm verification email
  // @route POST /auth/verify/confirm
  // @access Public
  public confirmVerification = asyncHandler(async (req: Request, res: Response<HttpResponse<null>>): Promise<void> => {
    const { token } = req.body;
    await this.authService.verifyEmail(token);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: 'Email verified successfully',
      data: null
    });
  });


  // @desc change password
  // @route POST /auth/change-password
  // @access Private
  public changePassword = asyncHandler(async (req: Request, res: Response<HttpResponse<null>>): Promise<void> => {
    const { tokenPayload } = req as RequestWithTokenPayload;
    const { oldPassword, newPassword } = req.body;

    if (!tokenPayload) {
      throw new HttpException(HttpStatusCodes.UNAUTHORIZED, 'Authentication required');
    }

    await this.authService.changePassword(tokenPayload._id.toString(), tokenPayload.type as 'adult' | 'child', oldPassword, newPassword);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: 'Password changed successfully',
      data: null
    });
  });

}
import { Types } from "mongoose";
import { AuthDao } from "@auth/auth.dao";
import { isEmpty } from '@common/utils/util';
import { generateTokens } from '@common/Token/token.util';
import { UserDTO, UserLoginDTO } from "@modules/User/user.dto";
import { HttpException } from "@common/errors/HttpException";
import HttpStatusCodes from '@common/utils/HttpStatusCodes';
import { IUser } from '@modules/User/user.interface';
import { type ICookie } from '@modules/Authentication/auth.interface';
import { compare, genSalt, hash } from "bcryptjs";
import { RoleModel } from '@modules/AccessControl/role.model';
import { type ITokenPayload } from '@common/Token/token.interface';
import { User } from "@modules/User/user.schema";
import { ChildModel } from "../Child/child.model";
import UserToken from "@common/Token/token.schema";
import { emailService } from "@infra/mail/email.service";
import { PermissionModel } from "../AccessControl/permission.model";
import crypto from 'crypto';
import { logger } from "@utils/logger";

export class AuthService {
  private authDao = new AuthDao();

  // SIGNUP
  public async signup(payload: UserDTO): Promise<IUser> {
    if (payload.email) {
      payload.email = payload.email.trim().toLowerCase();
    }
    logger.info(`Starting signup for email: ${payload.email}`);
    if (isEmpty(payload)) {
      logger.error('Signup failed: user payload is empty');
      throw new HttpException(HttpStatusCodes.BAD_REQUEST, 'userData is empty');
    }

    const exists = await this.authDao.findByEmailOrUsernamel(payload.email);
    if (exists) {
      logger.warn(`Signup failed: Email ${payload.email} already registered`);
      throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Email already registered");
    }

    let roleIds: Types.ObjectId[] = [];

    if (payload.roleCodes && payload.roleCodes.length > 0) {
      // Dynamic Role lookup by code
      const foundRoles = await RoleModel.find({ code: { $in: payload.roleCodes } });
      if (foundRoles.length === 0) {
        throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Invalid role codes provided");
      }
      roleIds = foundRoles.map(r => r._id as Types.ObjectId);
    } else if (payload.roles && payload.roles.length > 0) {
      // Fallback to explicit IDs
      roleIds = payload.roles.map(roleId => new Types.ObjectId(roleId));
    } else {
      // Default fallback: Assign default 'user' role
      const defaultRole = await RoleModel.findOne({ code: 'user' });
      if (!defaultRole) throw new HttpException(HttpStatusCodes.INTERNAL_SERVER_ERROR, 'Default role not found');
      roleIds = [defaultRole._id as Types.ObjectId];
    }

    const userToCreate: Partial<IUser> = {
      firstname: payload.firstname,
      lastname: payload.lastname,
      email: payload.email,
      password: payload.password,
      roles: roleIds,
      isEmailVerified: true, // Auto verify user email directly
      ...(payload.phone ? { phone: payload.phone.trim() } : {}),
    };

    const createdUser = await this.authDao.createUser(userToCreate);

    logger.info(`User created successfully: ${createdUser.email}. Skipping verification email for now.`);
    // Automatically send verification email on signup
    // await this.sendVerificationEmail(createdUser.email, createdUser.firstname);

    return createdUser;
  }

  // LOGIN (Unified Child/Adult)
  public async login(userData: UserLoginDTO): Promise<{
    accessToken: string;
    cookie: ICookie;
    updatedUser: any;
    firstLogin: boolean;
    refreshToken: string;
    roleCodes: string[];
    permissions: string[];
    redirectRoute: string;
  }> {
    if (isEmpty(userData)) throw new HttpException(HttpStatusCodes.BAD_REQUEST, 'user data is empty');
    const identifier = userData.identifier.trim().toLowerCase();

    const isAdultLogin = identifier.includes('@');

    if (isAdultLogin) {
      const findUser = await this.authDao.findByEmailOrUsernamel(identifier);
      if (!findUser) throw new HttpException(HttpStatusCodes.CONFLICT, 'Email not registered.');

      if (findUser.status !== 'active') {
        throw new HttpException(HttpStatusCodes.FORBIDDEN, findUser.status === 'suspended' ? 'Account suspended.' : 'Account blocked.');
      }

      // Block login if email is not verified
      if (!findUser.isEmailVerified) {
        throw new HttpException(HttpStatusCodes.FORBIDDEN, 'Please verify your email before logging in. Check your inbox for the verification link.');
      }

      const isPasswordMatching = await compare(userData.password, findUser.password);
      if (!isPasswordMatching) throw new HttpException(HttpStatusCodes.CONFLICT, 'Password invalid.');

      const firstLogin = !findUser.lastLogin;
      const updatedUser = await this.authDao.updateLastLogin(findUser._id);

      // FETCH ROLE CODES FOR REDIRECTS
      const roles = await RoleModel.find({ _id: { $in: findUser.roles } });
      const roleCodes = roles.map(r => r.code);

      let redirectRoute = '/'; // fallback for 'user' role
      if (roleCodes.includes('super_admin') || roleCodes.includes('admin')) redirectRoute = '/admin/dashboard';
      else if (roleCodes.includes('instructor')) redirectRoute = '/instructor/dashboard';
      else if (roleCodes.includes('parent')) redirectRoute = '/parent/dashboard';
      else if (roleCodes.includes('student')) redirectRoute = '/student/dashboard';

      const TokenPayload: any = {
        _id: findUser._id,
        role: findUser.roles,
        type: 'adult'
      };

      const { accessToken, refreshToken } = await generateTokens(TokenPayload);
      const cookie = this.createCookie(refreshToken);

      // FETCH PERMISSIONS FOR ROLES
      const permissionKeys = roles.length > 0
        ? (await PermissionModel.find({ _id: { $in: roles.flatMap(r => r.permissions) } })).map(p => p.key)
        : [];

      logger.info(`Successful login for ${identifier}`);
      return {
        accessToken,
        cookie,
        updatedUser: updatedUser!,
        firstLogin,
        refreshToken,
        roleCodes,
        permissions: permissionKeys,
        redirectRoute
      };
    } else {
      // CHILD LOGIN
      logger.info(`Starting child login for username: ${identifier}`);
      const child = await ChildModel.findOne({ username: identifier });
      if (!child) {
        logger.warn(`Child login failed: username ${identifier} not found`);
        throw new HttpException(HttpStatusCodes.NOT_FOUND, 'Child username not found.');
      }

      if (child.status !== 'active') throw new HttpException(HttpStatusCodes.FORBIDDEN, 'Profile suspended.');

      const isPinMatching = await compare(userData.password, child.pin);
      if (!isPinMatching) {
        logger.warn(`Child login failed: Invalid PIN for username ${identifier}`);
        throw new HttpException(HttpStatusCodes.CONFLICT, 'Invalid PIN.');
      }

      // Enrollment check moved to frontend to display locked dashboard
      const EnrollmentModel = (await import('@modules/Enrollments/enrollment.model')).EnrollmentModel;
      const activeEnrollment = await EnrollmentModel.findOne({ child: child._id, status: 'ACTIVE' });
      // We no longer throw an exception here. The dashboard will handle the locked state.

      const childRole = await RoleModel.findOne({ code: 'child' }).populate('permissions');

      const TokenPayload: any = {
        _id: child._id,
        role: childRole ? [childRole._id] : [],
        type: 'child'
      };

      const { accessToken, refreshToken } = await generateTokens(TokenPayload);
      const cookie = this.createCookie(refreshToken);

      logger.info(`Successful child login for ${identifier}`);
      return {
        accessToken,
        cookie,
        updatedUser: child,
        firstLogin: false,
        refreshToken,
        roleCodes: ['child'],
        permissions: childRole ? (childRole.permissions as any).map((p: any) => p.key) : [],
        redirectRoute: '/student/dashboard'
      };
    }
  }

  // LOGOUT
  public async logout(tokenPayload: ITokenPayload): Promise<IUser> {
    logger.info(`Processing logout for user ID: ${tokenPayload._id}`);
    if (isEmpty(tokenPayload)) {
      throw new HttpException(HttpStatusCodes.BAD_REQUEST, 'Token is empty');
    }

    const { _id } = tokenPayload;

    // Delete existing refresh tokens for this user
    await UserToken.deleteOne({ userId: _id });

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        $set: {
          isOnline: false,
        },
      },
      { new: true }
    ).lean();

    if (!updatedUser) {
      throw new HttpException(
        HttpStatusCodes.CONFLICT,
        `User with id ${_id} was not found`
      );
    }

    return updatedUser;
  }

  // RESET PASSWORD
  // FORGOT PASSWORD
  public forgotPassword = async (email: string): Promise<void> => {
    const userEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: userEmail });

    // Check if user exists
    if (!user) {
      throw new HttpException(HttpStatusCodes.NOT_FOUND, 'Email is not registered yet.');
    }

    const { token, hashedToken, expires } = this.generateSecureToken(1); // 1 hour

    await User.findByIdAndUpdate(user._id, {
      passwordResetToken: hashedToken,
      passwordResetExpires: expires,
    });

    // Send reset email via service
    await emailService.sendPasswordResetEmail(userEmail, user.firstname, token);
    logger.info(`Password reset email sent to: ${userEmail}`);
  };

  // RESET PASSWORD
  public resetPassword = async (token: string, password: string): Promise<void> => {
    if (!token) throw new HttpException(HttpStatusCodes.BAD_REQUEST, 'Reset token is required');
    if (!password) throw new HttpException(HttpStatusCodes.BAD_REQUEST, 'New password is required');

    // Hash the token received from URL
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user by hashed token and check expiration
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new HttpException(HttpStatusCodes.BAD_REQUEST, 'Invalid or expired reset token');
    }

    // Update password and clear reset fields
    // Use user.save() to trigger pre-save password hashing hook
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    logger.info(`Password reset successful for user: ${user.email}`);
  };

  // CHANGE PASSWORD
  public changePassword = async (userId: string, userType: 'adult' | 'child', oldPassword: string, newPassword: string): Promise<void> => {
    if (!oldPassword || !newPassword) throw new HttpException(HttpStatusCodes.BAD_REQUEST, 'Both old and new passwords are required');

    if (userType === 'adult') {
      const user = await User.findById(userId).select('+password');
      if (!user) throw new HttpException(HttpStatusCodes.NOT_FOUND, 'User not found');

      const isMatch = await compare(oldPassword, user.password);
      if (!isMatch) throw new HttpException(HttpStatusCodes.BAD_REQUEST, 'Current password incorrect');

      user.password = newPassword;
      await user.save();
      logger.info(`Password changed successfully for adult user: ${user.email}`);
    } else {
      const child = await ChildModel.findById(userId);
      if (!child) throw new HttpException(HttpStatusCodes.NOT_FOUND, 'Child profile not found');

      const isMatch = await compare(oldPassword, child.pin);
      if (!isMatch) throw new HttpException(HttpStatusCodes.BAD_REQUEST, 'Current PIN incorrect');

      child.pin = await hash(newPassword, 10);
      await child.save();
      logger.info(`PIN changed successfully for child user: ${child.username}`);
    }
  };

  /**
   * Generates a secure random token and its hash
   */
  private generateSecureToken(expiryHours: number): { token: string; hashedToken: string; expires: Date } {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expires = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

    return { token: rawToken, hashedToken, expires };
  }

  // VERIFICATION
  public sendVerificationEmail = async (email: string, firstname?: string): Promise<string> => {
    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });
    // If user already exists and is verified, we shouldn't send another one for signup
    if (user && user.isEmailVerified) throw new HttpException(HttpStatusCodes.BAD_REQUEST, 'Email already verified');

    const { token, hashedToken, expires } = this.generateSecureToken(24); // 24 hours

    if (user) {
      // Update existing user
      await User.findByIdAndUpdate(user._id, {
        verificationToken: hashedToken,
        verificationTokenExpires: expires,
      });

      // Use stored firstname if not provided as argument
      if (!firstname) {
        firstname = user.firstname;
      }
    } else {
      // This part depends on if you want to support pre-signup verification
      // For now, let's assume we are verifying an existing unverified user
      throw new HttpException(HttpStatusCodes.NOT_FOUND, 'User not found');
    }

    // Send email via the new Email Service (Link-based)
    await emailService.sendVerificationEmail(email, firstname || 'User', token);

    // [DEVELOPMENT ONLY] Log the link so you can test without email
    logger.info(`Verification link for ${email}: ${process.env.CLIENT_URL}auth/verify-email?token=${token}`);

    return token;
  };

  // CONFIRM VERIFICATION
  public verifyEmail = async (token: string): Promise<void> => {
    if (!token) throw new HttpException(HttpStatusCodes.BAD_REQUEST, 'Verification token is required');

    // Hash the token received from the URL
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user by hashed token and check expiration
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new HttpException(HttpStatusCodes.BAD_REQUEST, 'Invalid or expired verification token');
    }

    // Mark as verified and clear token fields
    await User.findByIdAndUpdate(user._id, {
      $set: { isEmailVerified: true },
      $unset: { verificationToken: 1, verificationTokenExpires: 1 },
    });
    logger.info(`Email verified successfully for user: ${user.email}`);
  };



  // COOKIES
  public createCookie(refreshToken: string): ICookie {
    return {
      name: 'refreshToken',
      options: {
        httpOnly: true, // only accessible by a web server
        maxAge: 1000 * 60 * 60 * 24 * 7, // expires in 1 week
        secure: false, // Set to true in prod
        sameSite: 'lax',
      },
      value: refreshToken,
    };
  }
}

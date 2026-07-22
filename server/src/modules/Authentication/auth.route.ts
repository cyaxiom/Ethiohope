import { AuthController } from "@auth/auth.controller";
import { Routes } from '@common/interfaces/route.interface';
import limiterMiddleware from '@common/middlewares/rateLimiter.middleware';
import validationMiddleware from '@common/middlewares/validation.middleware';
import { UserDTO, UserLoginDTO } from '@modules/User/user.dto';
import { Router } from 'express';
import { authMiddleware } from '@common/middlewares/auth.middleware';

export class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/signup", validationMiddleware(UserDTO, 'body'), this.authController.signup);
    this.router.post("/signin", limiterMiddleware, validationMiddleware(UserLoginDTO, 'body'), this.authController.logIn);
    this.router.post("/logout", authMiddleware, this.authController.logOut);
    this.router.get("/refresh", this.authController.refresh);
    this.router.post("/forget", this.authController.forgetPassword);
    this.router.post("/reset", this.authController.resetPassword);
    this.router.post("/verify", limiterMiddleware, this.authController.sendVerificationEmail);
    this.router.post("/verify/confirm", limiterMiddleware, this.authController.confirmVerification);
    this.router.post("/change-password", authMiddleware, this.authController.changePassword as any);
    
  }
}
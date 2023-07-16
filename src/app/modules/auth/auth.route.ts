import express from 'express';
import { UserRoles } from '../../../shared/enums';
import authorize from '../../middlewares/authorize.middleware';
import { validateRequestWithZod } from '../../middlewares/validateRequestWithZod.middleware';
import { AuthController } from './auth.controller';
import { AuthValidationZodSchema } from './auth.validation';

const authRouter = express.Router();

authRouter.get(
  '/my-profile',
  authorize([UserRoles.USER]),
  AuthController.getMyProfile
);

authRouter.post(
  '/register',
  validateRequestWithZod(AuthValidationZodSchema.registerUserSchema),
  AuthController.register
);

authRouter.post(
  '/login',
  validateRequestWithZod(AuthValidationZodSchema.loginUserSchema),
  AuthController.login
);

authRouter.post(
  '/refresh-token',
  validateRequestWithZod(AuthValidationZodSchema.refreshTokenSchema),
  AuthController.refreshToken
);

export const AuthRouter = authRouter;

import express from 'express';
import { UserRoles } from '../../../shared/enums';
import authorize from '../../middlewares/authorize.middleware';
import { validateRequestWithZod } from '../../middlewares/validateRequestWithZod.middleware';
import { UserController } from './user.controller';
import { UserValidationSchema } from './user.validate';

const userRouter = express.Router();

userRouter.get('/', authorize([UserRoles.ADMIN]), UserController.getAllUsers);
userRouter.get('/getAllAuthors', UserController.getAllAuthors);

userRouter.patch(
  '/:id',
  validateRequestWithZod(UserValidationSchema.updateZodValidateSchema),
  authorize([]),
  UserController.updateUser
);

userRouter.get('/:id', UserController.getSingleUser);

userRouter.delete('/:id', authorize([]), UserController.deleteUser);

export const UserRouter = userRouter;

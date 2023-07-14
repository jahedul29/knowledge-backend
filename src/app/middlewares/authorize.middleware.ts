import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import { JwtHelpers } from '../../helpers/jwtHelpers';
import { ApiError } from '../../shared/errors/errors.clsses';

const authorize =
  (requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized');
      }

      const userData = JwtHelpers.verifyToken(
        token,
        config.jwt.secret as Secret
      );

      if (!userData) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Token not valid');
      }

      if (requiredRoles.length && !requiredRoles.includes(userData.role)) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          'You are not allowed to perform this operation'
        );
      }

      req.user = userData;
      next();
    } catch (error) {
      next(error);
    }
  };

export default authorize;

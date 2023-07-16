import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { JwtHelpers } from '../../../helpers/jwtHelpers';
import { ApiError } from '../../../shared/errors/errors.clsses';
import { IUser } from '../user/user.interface';
import User from '../user/user.model';
import {
  IRefreshTokenResponse,
  IUserLoginData,
  IUserLoginResponse,
} from './auth.interface';

const register = async (user: IUser): Promise<IUser | null> => {
  const registeredUser = await User.create(user);
  return registeredUser;
};

const login = async (
  loginData: IUserLoginData
): Promise<IUserLoginResponse | null> => {
  const { email, password } = loginData;

  const isUserExist = await User.isUserExist(email);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!(await User.isPasswordMatch(password, isUserExist.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, `Password doesn't match.`);
  }

  const accessToken = JwtHelpers.createToken(
    { _id: isUserExist._id, role: isUserExist.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  const refreshToken = JwtHelpers.createToken(
    { _id: isUserExist._id, role: isUserExist.role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (
  refreshToken: string
): Promise<IRefreshTokenResponse | null> => {
  const userData = JwtHelpers.verifyToken(
    refreshToken,
    config.jwt.refresh_secret as Secret
  );

  if (!userData) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Your refresh token is expired'
    );
  }

  const user = await User.findById(userData._id);

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User does not exist');
  }

  const accessToken = JwtHelpers.createToken(
    { _id: userData._id, role: userData.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken,
  };
};

const getMyProfile = async (id: string): Promise<IUser | null> => {
  const profile = await User.findOne({ _id: id });
  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, 'profile not found');
  }
  return profile;
};

export const AuthService = {
  register,
  login,
  refreshToken,
  getMyProfile,
};

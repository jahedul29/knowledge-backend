/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { AuthService } from './auth.service';

const register: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body;

    const registeredUser = await AuthService.register(userData);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'User registered successfully',
      data: registeredUser,
    });
  }
);

const login: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginData = req.body;

    let result = await AuthService.login(loginData);

    if (result?.refreshToken) {
      const { refreshToken, ...resultData } = result;

      if (refreshToken) {
        res.cookie('refreshToken', refreshToken);
      }

      result = resultData;
    }

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User logged in successfully',
      data: result,
    });
  }
);

const refreshToken: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.cookies;

    const result = await AuthService.refreshToken(refreshToken);

    if (refreshToken) {
      res.cookie('refreshToken', refreshToken);
    }

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'access token retrieved successfully',
      data: result,
    });
  }
);

const getMyProfile: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const savedUser = await AuthService.getMyProfile(req.user?._id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Profile retrieved successfully.',
      data: savedUser,
    });
  }
);

export const AuthController = {
  register,
  login,
  refreshToken,
  getMyProfile,
};

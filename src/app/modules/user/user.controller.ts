/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import { UserRoles } from '../../../shared/enums';
import { ApiError } from '../../../shared/errors/errors.clsses';
import { paginationOptions } from '../../../shared/pagination/pagination.constant';
import { pickQueryParams } from '../../../shared/pagination/pickQueryParams';
import { sendResponse } from '../../../shared/sendResponse';
import { userFilterOptions } from './user.constant';
import { UserService } from './user.service';

const updateUser: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const authorizedUser = req.user!;
    const user = req.body;

    if (authorizedUser.role === UserRoles.USER && authorizedUser?._id !== id) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'You are not allowed to perform this operation'
      );
    }

    const savedUser = await UserService.updateUser(user, id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User updated successfully',
      data: savedUser,
    });
  }
);

const getAllUsers: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = pickQueryParams(req.query, userFilterOptions);

    const paginationParams = pickQueryParams(req.query, paginationOptions);

    const savedUser = await UserService.getAllUsers(filters, paginationParams);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Users retrieved successfully',
      data: savedUser,
    });
  }
);

const getAllAuthors: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = pickQueryParams(req.query, userFilterOptions);

    const paginationParams = pickQueryParams(req.query, paginationOptions);
    const savedUser = await UserService.getAllAuthors(
      filters,
      paginationParams
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Authors retrieved successfully',
      data: savedUser,
    });
  }
);

const getSingleUser: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const savedUser = await UserService.getSingleUser(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User retrieved successfully',
      data: savedUser,
    });
  }
);

const deleteUser: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const authorizedUser = req.user!;

    if (authorizedUser.role === UserRoles.USER && authorizedUser?._id !== id) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'You are not allowed to perform this operation'
      );
    }

    const deletedUser = await UserService.deleteUser(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'User deleted successfully',
      data: deletedUser,
    });
  }
);

export const UserController = {
  updateUser,
  getAllUsers,
  getAllAuthors,
  getSingleUser,
  deleteUser,
};

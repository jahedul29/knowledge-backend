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
import { bookFilterOptions } from './book.constant';
import Book from './book.model';
import { BookService } from './book.service';

const createBook: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookData = req.body;

    const authorizedUser = req.user!;
    bookData.author = authorizedUser._id;

    const savedBook = await BookService.createBook(bookData);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Book created successfully',
      data: savedBook,
    });
  }
);

const updateBook: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const authorizedUser = req.user!;
    const book = req.body;

    const author = await Book.getAuthor(id);

    if (
      authorizedUser.role === UserRoles.USER &&
      authorizedUser?._id === author?._id.toString()
    ) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'You are not allowed to perform this operation'
      );
    }

    const savedBook = await BookService.updateBook(book, id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Book updated successfully',
      data: savedBook,
    });
  }
);

const getAllBooks: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = pickQueryParams(req.query, bookFilterOptions);

    const paginationParams = pickQueryParams(req.query, paginationOptions);

    const savedBook = await BookService.getAllBooks(filters, paginationParams);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Books retrieved successfully',
      data: savedBook,
    });
  }
);

const getSingleBook: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const savedBook = await BookService.getSingleBook(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Book retrieved successfully',
      data: savedBook,
    });
  }
);

const deleteBook: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const authorizedUser = req.user!;

    const author = await Book.getAuthor(id);

    if (
      authorizedUser.role === UserRoles.USER &&
      authorizedUser?._id === author?._id.toString()
    ) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'You are not allowed to perform this operation'
      );
    }

    const deletedBook = await BookService.deleteBook(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Book deleted successfully',
      data: deletedBook,
    });
  }
);

export const BookController = {
  createBook,
  updateBook,
  getAllBooks,
  getSingleBook,
  deleteBook,
};

/* eslint-disable no-unused-expressions */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../../config';
import { ApiError } from '../../shared/errors/errors.clsses';
import { ErrorHandler } from '../../shared/errors/errors.handlers';
import { IGenericErrorMessage } from '../../shared/errors/errors.interfaces';
import { errorLogger } from '../../shared/logger';

export const errorHandling: ErrorRequestHandler = (
  err,
  req,
  res,
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  next
) => {
  config.env === 'development'
    ? errorLogger.error(
        `Showing error from global error handler: ${JSON.stringify(err)}`
      )
    : errorLogger.error(
        `Showing error from global error handler: ${JSON.stringify(err)}`
      );

  let statusCode = 500;
  let message = 'Something went wrong';
  let errorMessages: IGenericErrorMessage[] = [];

  if (config.env === 'development') {
    if (err?.name === 'ValidationError') {
      const simplifiedError = ErrorHandler.handleValidationError(err);
      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message;
      errorMessages = simplifiedError.errorMessages;
    } else if (err instanceof ZodError) {
      const simplifiedError = ErrorHandler.handleZodError(err);
      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message;
      errorMessages = simplifiedError.errorMessages;
    } else if (err?.name === 'CastError') {
      const simplifiedError = ErrorHandler.handleSimplifiedError(err);
      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message;
      errorMessages = simplifiedError.errorMessages;
    } else if (err instanceof Error) {
      message = err.message;
      errorMessages = [
        {
          path: '',
          message: err?.message,
        },
      ];
    } else if (err instanceof ApiError) {
      statusCode = err?.statusCode;
      message = err?.message;
      errorMessages = err?.message
        ? [
            {
              path: '',
              message: err?.message,
            },
          ]
        : [];
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== 'production' ? err?.stack : undefined,
  });
};

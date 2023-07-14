import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { ZodError, ZodIssue } from 'zod';
import {
  IGenericErrorMessage,
  IGenericErrorResponse,
} from './errors.interfaces';

const handleValidationError = (
  err: mongoose.Error.ValidationError
): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = Object.values(err.errors).map(el => {
    return {
      path: el?.path,
      message: el?.message,
    };
  });
  return {
    statusCode: 400,
    message: err.message,
    errorMessages: errors,
  };
};

const handleZodError = (err: ZodError): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    };
  });

  return {
    statusCode: 400,
    message: 'Validation Error',
    errorMessages: errors,
  };
};

const handleSimplifiedError = (err: mongoose.Error.CastError) => {
  const errors = [
    {
      path: err.path,
      message: err.message,
    },
  ];
  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: 'Validation Error',
    errorMessages: errors,
  };
};

export const ErrorHandler = {
  handleValidationError,
  handleZodError,
  handleSimplifiedError,
};

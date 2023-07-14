import { Response } from 'express';

type IApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string | null;
  data?: T | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
};

//function for sending common success response for all apis
export const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
  const responseData: IApiResponse<T> = {
    success: true,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data || null,
    meta: data?.meta,
  };

  res.status(data.statusCode).json(responseData);
};

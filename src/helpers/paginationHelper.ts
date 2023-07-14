import { IPaginationParams } from '../shared/interfaces';

type IResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
};

const generatePaginationAndSortFields = (
  options: IPaginationParams
): IResult => {
  const page = Number(options?.page || 1);
  const limit = Number(options?.limit || 10);
  const skip = (page - 1) * limit;
  const sortBy = options?.sortBy || 'createdAt';
  const sortOrder = options?.sortOrder || 'desc';

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export const PaginationHelpers = {
  generatePaginationAndSortFields,
};

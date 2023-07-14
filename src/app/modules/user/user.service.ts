import httpStatus from 'http-status';
import { SortOrder } from 'mongoose';
import { PaginationHelpers } from '../../../helpers/paginationHelper';
import { ApiError } from '../../../shared/errors/errors.clsses';
import { IPaginationOptions } from '../../../shared/pagination/pagination.interface';
import { userSearchableFields } from './user.constant';
import { IUser, IUserFilters } from './user.interface';
import User from './user.model';

const updateUser = async (
  user: Partial<IUser>,
  id: string
): Promise<IUser | null> => {
  const isExist = await User.findById(id);

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const { name, ...userData } = user;

  const updatedUserData: Partial<IUser> = { ...userData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const keyName = `name.${key}` as keyof Partial<IUser>;
      (updatedUserData as any)[keyName] = name[key as keyof typeof name];
    });
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: id },
    updatedUserData,
    {
      new: true,
    }
  );

  return updatedUser;
};

const getAllUsers = async (
  filters: IUserFilters,
  paginationParams: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    PaginationHelpers.generatePaginationAndSortFields(paginationParams);

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const { searchTerm, ...filterData } = filters;
  const andConditions = [];
  let filterConditions = {};
  const searchableFields: string[] = userSearchableFields;

  if (searchTerm) {
    andConditions.push({
      $or: searchableFields.map((field: string) => {
        return {
          [field]: {
            $regex: new RegExp(searchTerm, 'i'),
          },
        };
      }),
    });

    filterConditions = { $and: andConditions };
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      $and: Object.entries(filterData).map(([field, value]) => {
        if (field === 'rating' && value) {
          return { rating: { $eq: parseInt(value) } };
        } else {
          return { [field]: value };
        }
      }),
    });

    filterConditions = { $and: andConditions };
  }

  const users = await User.find(filterConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments();

  return {
    data: users,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const getAllAuthors = async (
  filters: IUserFilters,
  paginationParams: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    PaginationHelpers.generatePaginationAndSortFields(paginationParams);

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const { searchTerm, ...filterData } = filters;
  const andConditions = [];
  let filterConditions = {};
  const searchableFields: string[] = userSearchableFields;
  andConditions.push({ isAuthor: true });
  filterConditions = { $and: andConditions };
  if (searchTerm) {
    andConditions.push({
      $or: searchableFields.map((field: string) => {
        return {
          [field]: {
            $regex: new RegExp(searchTerm, 'i'),
          },
        };
      }),
    });

    filterConditions = { $and: andConditions };
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      $and: Object.entries(filterData).map(([field, value]) => {
        if (field === 'rating' && value) {
          return { rating: { $eq: parseInt(value) } };
        } else {
          return { [field]: value };
        }
      }),
    });

    filterConditions = { $and: andConditions };
  }

  const users = await User.find(filterConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments();

  return {
    data: users,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const savedUser = await User.findById(id);
  if (!savedUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return savedUser;
};

const deleteUser = async (id: string): Promise<IUser | null> => {
  const savedUser = await User.findByIdAndDelete(id);
  return savedUser;
};

export const UserService = {
  updateUser,
  getAllUsers,
  getAllAuthors,
  getSingleUser,
  deleteUser,
};

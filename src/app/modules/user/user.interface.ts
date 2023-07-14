/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type IUserName = {
  firstName: string;
  lastName: string;
};

export type IWishlistItem = {
  bookId: Types.ObjectId;
  flag: 'reading' | 'read_later';
};

export type IUser = {
  phoneNumber: string;
  email: string;
  role: 'admin' | 'user';
  password: string;
  name: IUserName;
  dateOfBirth?: Date;
  profileImage?: string;
  address: string;
  rating: number;
  totalBooksPublished: number;
  isAuthor: boolean;
  wishlist: IWishlistItem[];
};

export type IUserMethods = object;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface UserModel extends Model<IUser, object, IUserMethods> {
  isUserExist(email: string): Promise<
    | (Pick<IUser, 'role' | 'password'> & {
        _id: Types.ObjectId;
      })
    | null
  >;
  isPasswordMatch(
    givenPassword: string,
    currentPassword: string
  ): Promise<boolean>;
}

export type IUserFilters = {
  searchTerm?: string;
  email?: string;
  role?: 'admin' | 'user';
  rating?: string;
};

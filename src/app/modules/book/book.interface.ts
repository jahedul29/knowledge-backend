/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export type IReviewItem = {
  reviewer: Types.ObjectId;
  rating: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IBook = {
  title: string;
  description: string;
  genre:
    | 'Fiction'
    | 'Non-fiction'
    | 'Mystery'
    | 'Thriller'
    | 'Science Fiction'
    | 'Fantasy'
    | 'Romance'
    | 'Historical'
    | 'Biography'
    | 'Self-help';
  author: Types.ObjectId;
  cover?: string;
  rating: number;
  publicationDate: Date;
  readingCount: number;
  alreadyReadCount: number;
  reviews: IReviewItem[];
};

export type IBookMethods = object;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface BookModel extends Model<IBook, object, IBookMethods> {
  getAuthor(id: string): Promise<
    | (IUser & {
        _id: Types.ObjectId;
      })
    | null
  >;
}

export type IBookFilters = {
  searchTerm?: string;
  genre?: string;
  rating?: string;
};

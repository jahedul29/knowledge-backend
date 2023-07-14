import httpStatus from 'http-status';
import { SortOrder } from 'mongoose';
import { PaginationHelpers } from '../../../helpers/paginationHelper';
import { ApiError } from '../../../shared/errors/errors.clsses';
import { IPaginationOptions } from '../../../shared/pagination/pagination.interface';
import { bookSearchableFields } from './book.constant';
import { IBook, IBookFilters } from './book.interface';
import Book from './book.model';

const createBook = async (bookData: IBook): Promise<IBook | null> => {
  const savedBook = await Book.create(bookData);
  return savedBook;
};

const updateBook = async (
  book: Partial<IBook>,
  id: string
): Promise<IBook | null> => {
  const isExist = await Book.findById(id);

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }

  const updatedBook = await Book.findOneAndUpdate({ _id: id }, book, {
    new: true,
  });

  return updatedBook;
};

const getAllBooks = async (
  filters: IBookFilters,
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
  const searchableFields: string[] = bookSearchableFields;

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

  const books = await Book.find(filterConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Book.countDocuments();

  return {
    data: books,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const getSingleBook = async (id: string): Promise<IBook | null> => {
  const book = await Book.findById(id);
  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }
  return book;
};

const deleteBook = async (id: string): Promise<IBook | null> => {
  const book = await Book.findById(id);
  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }
  const deletedBook = await Book.findByIdAndDelete(id);
  return deletedBook;
};

export const BookService = {
  createBook,
  updateBook,
  getAllBooks,
  getSingleBook,
  deleteBook,
};

import httpStatus from 'http-status';
import mongoose, { Schema, Types, model } from 'mongoose';
import { ApiError } from '../../../shared/errors/errors.clsses';
import { IUser } from '../user/user.interface';
import User from '../user/user.model';
import { bookGenreList } from './book.constant';
import { BookModel, IBook } from './book.interface';

const bookSchema = new Schema<IBook, BookModel>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      enum: bookGenreList,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cover: {
      type: String,
    },
    rating: {
      type: Number,
      default: 0,
    },
    publicationDate: {
      type: Date,
    },
    readingCount: {
      type: Number,
      default: 0,
    },
    alreadyReadCount: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: [
        {
          reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require: true,
          },
          rating: {
            type: String,
            default: 0,
          },
          description: {
            type: String,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
          updatedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

bookSchema.statics.getAuthor = async function (id: string): Promise<
  | (IUser & {
      _id: Types.ObjectId;
    })
  | null
> {
  const book = await Book.findOne(
    { _id: id },
    {
      _id: 1,
      author: 1,
    }
  ).lean();

  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }

  const author = await User.findById(book.author._id);

  if (!author) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Author not found');
  }

  return author;
};

const Book = model<IBook, BookModel>('Book', bookSchema);

export default Book;

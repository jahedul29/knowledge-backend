import { z } from 'zod';
import { bookGenreList } from './book.constant';

const createBookSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'title is required',
    }),
    description: z.string({
      required_error: 'description is required',
    }),
    genre: z.enum([...bookGenreList] as [string, ...string[]], {
      required_error: 'genre is required',
    }),
    cover: z.string().optional(),
    publicationDate: z.string().refine((value): value is string => {
      const parsedDate = new Date(value);
      return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
    }, 'Invalid publicationDate format'),
  }),
});

const updateBookSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    genre: z.enum([...bookGenreList] as [string, ...string[]]).optional(),
    cover: z.string().optional(),
    publicationDate: z.string().refine((value): value is string => {
      const parsedDate = new Date(value);
      return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
    }, 'Invalid publicationDate format'),
  }),
});

export const BookValidationZodSchema = {
  createBookSchema,
  updateBookSchema,
};

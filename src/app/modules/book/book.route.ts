import express from 'express';
import { UserRoles } from '../../../shared/enums';
import authorize from '../../middlewares/authorize.middleware';
import { validateRequestWithZod } from '../../middlewares/validateRequestWithZod.middleware';
import { BookController } from './book.controller';
import { BookValidationZodSchema } from './book.validate';

const bookRouter = express.Router();

bookRouter.post(
  '/',
  validateRequestWithZod(BookValidationZodSchema.createBookSchema),
  authorize([UserRoles.USER]),
  BookController.createBook
);
bookRouter.get('/', BookController.getAllBooks);

bookRouter.patch(
  '/:id',
  validateRequestWithZod(BookValidationZodSchema.updateBookSchema),
  authorize([]),
  BookController.updateBook
);

bookRouter.get('/:id', BookController.getSingleBook);

bookRouter.delete('/:id', authorize([]), BookController.deleteBook);

export const BookRouter = bookRouter;

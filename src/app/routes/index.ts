import express, { Router } from 'express';
import { AuthRouter } from '../modules/auth/auth.route';
import { BookRouter } from '../modules/book/book.route';
import { UserRouter } from '../modules/user/user.route';

const appRouter = express.Router();

const routes = [
  {
    path: '/users',
    route: UserRouter,
  },
  {
    path: '/auth',
    route: AuthRouter,
  },
  {
    path: '/books',
    route: BookRouter,
  },
];

routes.forEach((el: { path: string; route: Router }) =>
  appRouter.use(el.path, el.route)
);

export default appRouter;

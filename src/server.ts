import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config';
import { errorLogger, logger } from './shared/logger';

let server: Server;

const closeServer = () => {
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

process.on('uncaughtException', err => {
  errorLogger.error(`UncaughtException occured ${err}`);
  process.exit(1);
});

async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string);
    logger.info('Database connected successfully');

    server = app.listen(config.port, () => {
      logger.info(`Application is running on ${config.port}`);
    });
  } catch (error) {
    errorLogger.error('Failed to connect database', error);
  }

  process.on('unhandledRejection', async function (error) {
    errorLogger.error(`UnhandledRejection occured ${error}`);
    closeServer();
  });
}

bootstrap();

process.on('SIGTERM', () => {
  logger.info('SIGTERM process detected');
  closeServer();
});

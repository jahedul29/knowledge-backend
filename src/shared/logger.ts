import path from 'path';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import config from '../config';
const { combine, timestamp, label, printf, colorize } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${date.toLocaleDateString()} ${hours}:${minutes}:${seconds} [${label}] ${level}: ${message}`;
});

//creating success logger
const logger = createLogger({
  level: 'info',
  format: combine(label({ label: 'UM' }), timestamp(), myFormat, colorize()),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.Console({
      format: combine(colorize(), myFormat),
    }),
  ],
});

//creating error logger
const errorLogger = createLogger({
  level: 'error',
  format: combine(label({ label: 'UM' }), timestamp(), myFormat, colorize()),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.Console({
      format: combine(colorize(), myFormat),
    }),
  ],
});

// create logger file based on environment
// Note: Please comment below part if you are going to deploy it in any free hosting
if (config.env == 'production') {
  logger.add(
    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        'logs',
        'winston',
        'successes',
        'um-%DATE%-success.log'
      ),
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    })
  );
  errorLogger.add(
    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        'logs',
        'winston',
        'errors',
        'um-%DATE%-error.log'
      ),
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    })
  );
}

export { errorLogger, logger };

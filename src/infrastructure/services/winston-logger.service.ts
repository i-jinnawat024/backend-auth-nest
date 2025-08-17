import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import { ILoggerService, LogContext } from '../../domain/services/logger.service.interface';

@Injectable()
export class WinstonLoggerService implements ILoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
        winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
          const logEntry: any = {
            timestamp,
            level,
            message,
            service: 'auth-service',
          };
          if (context) {
            logEntry.context = context;
          }
          return JSON.stringify(logEntry);
        }),
      ),
      defaultMeta: { service: 'auth-service' },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
      ],
    });

    // Create logs directory if it doesn't exist
    const fs = require('fs');
    if (!fs.existsSync('logs')) {
      fs.mkdirSync('logs');
    }
  }

  log(message: string, context?: LogContext): void {
    this.logger.info(message, { context });
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.logger.error(message, {
      context,
      ...(error && {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      }),
    });
  }

  warn(message: string, context?: LogContext): void {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: LogContext): void {
    this.logger.debug(message, { context });
  }

  info(message: string, context?: LogContext): void {
    this.logger.info(message, { context });
  }
}
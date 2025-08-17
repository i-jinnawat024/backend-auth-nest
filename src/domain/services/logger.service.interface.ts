export interface LogContext {
  userId?: number;
  correlationId?: string;
  userAgent?: string;
  ip?: string;
  [key: string]: any;
}

export interface ILoggerService {
  log(message: string, context?: LogContext): void;
  error(message: string, error?: Error, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
}

export const LOGGER_SERVICE = Symbol('ILoggerService');
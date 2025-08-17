import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ILoggerService,
  LOGGER_SERVICE,
} from '../../domain/services/logger.service.interface';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(LOGGER_SERVICE)
    private readonly logger: ILoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorResponse = {
      statusCode: status,
      method: request.method,
      message:
        typeof message === 'string'
          ? message
          : (message as any).message || message,
    };

    // Log the error with context
    const logContext = {
      correlationId: request['correlationId'],
      userId: request['user']?.id,
      method: request.method,
      url: request.url,
      statusCode: status,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
    };

    if (status >= 500) {
      this.logger.error(
        `Internal Server Error: ${errorResponse.message}`,
        exception instanceof Error ? exception : new Error(String(exception)),
      );
    } else if (status >= 400) {
      this.logger.warn(`Client Error: ${errorResponse.message}`);
    }

    response.status(status).json(errorResponse);
  }
}

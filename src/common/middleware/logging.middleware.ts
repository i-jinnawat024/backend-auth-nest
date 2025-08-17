import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ILoggerService, LOGGER_SERVICE } from '../../domain/services/logger.service.interface';
import { MetricsService } from '../../metrics/metrics.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(
    @Inject(LOGGER_SERVICE)
    private readonly logger: ILoggerService,
    private readonly metricsService: MetricsService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const correlationId = uuidv4();
    
    // Add correlation ID to request
    req['correlationId'] = correlationId;
    
    // Add correlation ID to response headers
    res.setHeader('X-Correlation-ID', correlationId);

    const { method, originalUrl, ip, headers } = req;
    const userAgent = headers['user-agent'] || '';

    // Log incoming request
    this.logger.info(`Incoming ${method} ${originalUrl}`, {
      correlationId,
      method,
      url: originalUrl,
      ip,
      userAgent,
      requestId: correlationId,
    });

    // Increment active connections
    this.metricsService.incrementActiveConnections();

    // Override res.end to capture response
    const originalEnd = res.end;
    res.end = function(chunk: any, encoding?: any) {
      const duration = (Date.now() - startTime) / 1000;
      const { statusCode } = res;
      
      // Log response
      const logContext = {
        correlationId,
        method,
        url: originalUrl,
        statusCode,
        duration: `${duration}s`,
        ip,
        userAgent,
      };

      if (statusCode >= 400) {
        this.logger.error(`${method} ${originalUrl} - ${statusCode}`, undefined, logContext);
      } else {
        this.logger.info(`${method} ${originalUrl} - ${statusCode}`, logContext);
      }

      // Record metrics
      this.metricsService.recordHttpRequest(method, originalUrl, statusCode, duration);
      this.metricsService.decrementActiveConnections();

      originalEnd.call(this, chunk, encoding);
    }.bind(this);

    next();
  }
}
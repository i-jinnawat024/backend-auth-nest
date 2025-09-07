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

    // Skip logging for health check and metrics endpoints
    if (originalUrl.includes('/health') || originalUrl.includes('/metrics')) {
      next();
      return;
    }

    // Increment active connections
    this.metricsService.incrementActiveConnections();

    // Override res.end to capture response
    const originalEnd = res.end.bind(res);
    const self = this;
    res.end = function(chunk: any, encoding?: any, cb?: () => void) {
      const duration = (Date.now() - startTime) / 1000;
      const { statusCode } = res;

      if (statusCode >= 400) {
        self.logger.error(`Client Error: ${method} ${originalUrl}`);
      }

      // Record metrics
      self.metricsService.recordHttpRequest(method, originalUrl, statusCode, duration);
      self.metricsService.decrementActiveConnections();

      return originalEnd(chunk, encoding, cb);
    };

    next();
  }
}
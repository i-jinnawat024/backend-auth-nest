import { Injectable } from '@nestjs/common';
import { register, Counter, Histogram, Gauge } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly httpRequestsTotal: Counter<string>;
  private readonly httpRequestDuration: Histogram<string>;
  private readonly activeConnections: Gauge<string>;
  private readonly authAttempts: Counter<string>;
  private readonly tokenGenerated: Counter<string>;

  constructor() {
    // HTTP Metrics
    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [register],
    });

    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
      registers: [register],
    });

    this.activeConnections = new Gauge({
      name: 'active_connections',
      help: 'Number of active connections',
      registers: [register],
    });

    // Auth-specific metrics
    this.authAttempts = new Counter({
      name: 'auth_attempts_total',
      help: 'Total number of authentication attempts',
      labelNames: ['type', 'status'],
      registers: [register],
    });

    this.tokenGenerated = new Counter({
      name: 'tokens_generated_total',
      help: 'Total number of tokens generated',
      labelNames: ['type'],
      registers: [register],
    });
  }

  recordHttpRequest(method: string, route: string, statusCode: number, duration: number) {
    this.httpRequestsTotal.inc({ method, route, status_code: statusCode.toString() });
    this.httpRequestDuration.observe({ method, route, status_code: statusCode.toString() }, duration);
  }

  incrementActiveConnections() {
    this.activeConnections.inc();
  }

  decrementActiveConnections() {
    this.activeConnections.dec();
  }

  recordAuthAttempt(type: 'login' | 'register' | 'refresh', status: 'success' | 'failure') {
    this.authAttempts.inc({ type, status });
  }

  recordTokenGeneration(type: 'access' | 'refresh') {
    this.tokenGenerated.inc({ type });
  }

  async getMetrics(): Promise<string> {
    return register.metrics();
  }
}
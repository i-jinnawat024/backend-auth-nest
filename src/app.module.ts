import { Module, MiddlewareConsumer } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './config/db.module';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { UsersModule } from './users/users.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { MetricsModule } from './metrics/metrics.module';
import { LoggingMiddleware } from './common/middleware/logging.middleware';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { WinstonLoggerService } from './infrastructure/services/winston-logger.service';
import { LOGGER_SERVICE } from './domain/services/logger.service.interface';

@Module({
  imports: [
    AuthModule,
    DbModule,
    UsersModule,
    PassportModule,
    HealthModule,
    MetricsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV}.local`,
        `.env.${process.env.NODE_ENV}`,
        '.env.development.local',
        '.env'
      ].filter(Boolean),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    {
      provide: LOGGER_SERVICE,
      useClass: WinstonLoggerService,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}

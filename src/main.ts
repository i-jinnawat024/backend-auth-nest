import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  const port = configService.get<number>('PORT', 3000);
  const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:4200');
  const rateLimitWindowMs = configService.get<number>('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000);
  const rateLimitMax = configService.get<number>('RATE_LIMIT_MAX', 100);
  
  app.use(helmet());

  app.use(
    rateLimit({
      windowMs: rateLimitWindowMs,
      max: rateLimitMax,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.enableCors({
    origin: corsOrigin.split(',').map(origin => origin.trim()), 
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(port, () => {
    console.log(`🚀 Auth Service running on port ${port}`);
    console.log(`📝 Environment: ${configService.get<string>('NODE_ENV', 'development')}`);
  });
}
bootstrap();

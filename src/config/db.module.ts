// db.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
(global as any).crypto = crypto;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mssql',
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT', '1433')),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        synchronize: config.get<string>('DB_SYNCHRONIZE') === 'true',
        logging: config.get<string>('DB_LOGGING') === 'true',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        options: {
          encrypt: config.get<string>('DB_ENCRYPT') === 'true',
        },
        extra: {
          trustServerCertificate:
            config.get<string>('DB_TRUST_SERVER_CERTIFICATE') === 'true',
        },
      }),
    }),
  ],
})
export class DbModule {}

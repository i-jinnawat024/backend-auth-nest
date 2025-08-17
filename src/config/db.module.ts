import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserOrmEntity } from '../infrastructure/persistence/entities/user-orm.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        // ถ้ามี DATABASE_URL ให้ใช้
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
            logging: configService.get<boolean>('DB_LOGGING'),
            ssl: { rejectUnauthorized: false },
            entities: [UserOrmEntity],
          };
        }

        // Legacy config format
        const dbType = configService.get<string>('DB_TYPE');
        return {
          type: dbType as any,
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
          logging: configService.get<boolean>('DB_LOGGING'),
          ssl: configService.get<boolean>('DB_SSL')
            ? { rejectUnauthorized: false }
            : false,
          entities: [UserOrmEntity],
        };
      },
    }),
  ],
})
export class DbModule {}

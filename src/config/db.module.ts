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
        console.log('DATABASE_URL:', databaseUrl);
        console.log('NODE_ENV:', process.env.NODE_ENV);
        // ถ้ามี DATABASE_URL ให้ใช้
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            synchronize: configService.get<boolean>('DB_SYNCHRONIZE', true),
            logging: configService.get<boolean>('DB_LOGGING', false),
            ssl: { rejectUnauthorized: false },
            entities: [UserOrmEntity],
          };
        }
        
    

        // Legacy config format
        const dbType = configService.get<string>('DB_TYPE', 'postgres');
        return {
          type: dbType as any,
          host: configService.get<string>('DB_HOST', 'hopper.proxy.rlwy.net'),
          port: +configService.get<number>('DB_PORT',52969),
          username: configService.get<string>('DB_USERNAME',),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          synchronize: configService.get<boolean>('DB_SYNCHRONIZE', true),
          logging: configService.get<boolean>('DB_LOGGING', false),
          ssl: configService.get<boolean>('DB_SSL', false) ? { rejectUnauthorized: false } : false,
          entities: [UserOrmEntity],
        };
      },
    }),
  ],
})
export class DbModule {}

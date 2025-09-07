import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

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

        const dbType = configService.get<string>('DB_TYPE');
        return {
          type: dbType as 'mssql',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
          logging: configService.get<boolean>('DB_LOGGING'),
          ssl: configService.get<boolean>('DB_SSL') ? { rejectUnauthorized: false } : false,
          entities: [UserOrmEntity],
        };
      },
      extra: {
        trustServerCertificate: true,
      },
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    }),
  ],
})
export class DbModule {}

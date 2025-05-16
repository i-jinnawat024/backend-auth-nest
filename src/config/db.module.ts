import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      port: 1433,
      username: 'admin',
      password: 'art',
      database: 'nestJS_CRUD',
      synchronize: true, 
      // logging: true,
      options: {
        encrypt: false, 
      },
      extra: {
        trustServerCertificate: true, 
      },
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    }),
  ],
})
export class DbModule {}

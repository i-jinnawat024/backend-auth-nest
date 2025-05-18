import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './src/users/users.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '1433'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: false,
  entities: ['src/**/*.entity.ts'], 
  migrations: ['src/migrations/*.ts'],
  options: {
    encrypt: true,
  },
  extra: {
    trustServerCertificate: true,
  },
});

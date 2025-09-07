import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './config/db.module';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { UsersModule } from './users/users.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    AuthModule,
    DbModule,
    UsersModule,
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true,
<<<<<<< Updated upstream
=======
      envFilePath: [
        `.env.${process.env.NODE_ENV}.local`,
        `.env.${process.env.NODE_ENV}`,
        '.env.development.local',
        '.env',
      ].filter(Boolean),
>>>>>>> Stashed changes
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}

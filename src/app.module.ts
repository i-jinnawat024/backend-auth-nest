import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './config/db.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { UsersModule } from './users/users.module';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [AuthModule,DbModule,UsersModule,PassportModule],
  controllers: [AppController],
  providers: [AppService,JwtStrategy],
})
export class AppModule {}

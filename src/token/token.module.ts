import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_REFRESH_SECRET'),
            signOptions: { expiresIn: configService.get<string>('JWT_REFRESH_EXPIRES_IN') },
          }),
        }), 
    ConfigModule,
    UsersModule,
  ],
  providers: [TokenService],
  exports: [TokenService], 
})
export class TokenModule {}

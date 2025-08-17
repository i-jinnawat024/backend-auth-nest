import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from 'src/mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from '../infrastructure/persistence/entities/user-orm.entity';
import { UserRepository } from '../infrastructure/persistence/repositories/user.repository';
import { HashService } from '../infrastructure/services/hash.service';
import { JwtTokenService } from '../infrastructure/services/jwt-token.service';
import { LoginUseCase } from '../application/use-cases/auth/login.use-case';
import { RegisterUseCase } from '../application/use-cases/auth/register.use-case';
import { LogoutUseCase } from '../application/use-cases/auth/logout.use-case';
import { RefreshTokenUseCase } from '../application/use-cases/auth/refresh-token.use-case';
import { VerifyEmailUseCase } from '../application/use-cases/auth/verify-email.use-case';
import { USER_REPOSITORY } from '../domain/repositories/user.repository.interface';
import { HASH_SERVICE } from '../domain/services/hash.service.interface';
import { TOKEN_SERVICE } from '../domain/services/token.service.interface';
import { MAIL_SERVICE } from '../domain/services/mail.service.interface';
import { LOGGER_SERVICE } from '../domain/services/logger.service.interface';
import { MailService } from '../mail/mail.service';
import { WinstonLoggerService } from '../infrastructure/services/winston-logger.service';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([UserOrmEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
    MailModule,
  ],
  controllers: [AuthController],

  providers: [
    // Use Cases
    LoginUseCase,
    RegisterUseCase,
    LogoutUseCase,
    RefreshTokenUseCase,
    VerifyEmailUseCase,
    
    // Services
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: HASH_SERVICE,
      useClass: HashService,
    },
    {
      provide: TOKEN_SERVICE,
      useClass: JwtTokenService,
    },
    {
      provide: MAIL_SERVICE,
      useClass: MailService,
    },
    {
      provide: LOGGER_SERVICE,
      useClass: WinstonLoggerService,
    },
  ],
  exports: [
    LoginUseCase,
    RegisterUseCase,
    LogoutUseCase,
    RefreshTokenUseCase,
    VerifyEmailUseCase,
  ],
})
export class AuthModule {}

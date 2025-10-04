import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { EmailVerificationCode } from '../../domain/entities/email-verification-code.entity';
import { IEmailVerificationCodeRepository } from '../../domain/repositories/email-verification-code.repository.interface';
import { EmailVerificationCodeEntity } from './email-verification-code.entity';

@Injectable()
export class EmailVerificationCodeRepository implements IEmailVerificationCodeRepository {
  constructor(
    @InjectRepository(EmailVerificationCodeEntity)
    private readonly repository: Repository<EmailVerificationCodeEntity>,
  ) {}

  async save(code: EmailVerificationCode): Promise<EmailVerificationCode> {
    const entity = this.toEntity(code);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async findByEmailAndCode(email: string, code: string): Promise<EmailVerificationCode | null> {
    const entity = await this.repository.findOne({
      where: { email, code, isUsed: false },
      order: { createdAt: 'DESC' },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findLatestByEmail(email: string): Promise<EmailVerificationCode | null> {
    const entity = await this.repository.findOne({
      where: { email },
      order: { createdAt: 'DESC' },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async deleteExpiredCodes(): Promise<void> {
    await this.repository.delete({
      expiresAt: LessThan(new Date()),
    });
  }

  async deleteByEmail(email: string): Promise<void> {
    await this.repository.delete({ email });
  }

  private toEntity(domain: EmailVerificationCode): EmailVerificationCodeEntity {
    const entity = new EmailVerificationCodeEntity();
    entity.id = domain.id;
    entity.email = domain.email;
    entity.code = domain.code;
    entity.expiresAt = domain.expiresAt;
    entity.isUsed = domain.isUsed;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }

  private toDomain(entity: EmailVerificationCodeEntity): EmailVerificationCode {
    return new EmailVerificationCode(
      entity.id,
      entity.email,
      entity.code,
      entity.expiresAt,
      entity.isUsed,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
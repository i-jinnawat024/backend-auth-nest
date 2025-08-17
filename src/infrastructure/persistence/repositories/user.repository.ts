import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { UserOrmEntity } from '../entities/user-orm.entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly ormRepository: Repository<UserOrmEntity>,
  ) {}

  async findById(id: number): Promise<User | null> {
    const ormEntity = await this.ormRepository.findOne({ where: { id } });
    return ormEntity ? UserMapper.toDomain(ormEntity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const ormEntity = await this.ormRepository.findOne({ where: { email } });
    return ormEntity ? UserMapper.toDomain(ormEntity) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const ormEntity = await this.ormRepository.findOne({ where: { username } });
    return ormEntity ? UserMapper.toDomain(ormEntity) : null;
  }

  async findByEmailVerificationToken(token: string): Promise<User | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { emailVerificationToken: token },
    });
    return ormEntity ? UserMapper.toDomain(ormEntity) : null;
  }

  async save(user: User): Promise<User> {
    const ormEntity = UserMapper.toOrm(user);
    const savedEntity = await this.ormRepository.save(ormEntity);
    return UserMapper.toDomain(savedEntity);
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  async findAll(): Promise<User[]> {
    const ormEntities = await this.ormRepository.find({ where: { isActive: true } });
    return ormEntities.map(UserMapper.toDomain);
  }
}
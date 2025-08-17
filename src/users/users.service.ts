// users/users.service.ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { LoginDto } from '../auth/dto/login.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneByField(
    field: keyof User,
    value: string | number,
  ): Promise<User | null> {
    return this.userRepository.findOne({
      where: { [field]: value },
    });
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async create(loginDto: LoginDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(loginDto.password, salt);

    const user = this.userRepository.create({
      ...loginDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async findAll() {
    return this.userRepository.find({ where: { isActive: true } });
  }

  async updateUser(user: User, updateUserDto: UpdateUserDto) {
    const { password, confirmPassword, ...rest } = updateUserDto;
    if (password && password == confirmPassword) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(password, salt);
    }

    Object.assign(user, rest);
    return this.userRepository.save(user);
  }

  async remove(user: User) {
    user.isActive = false;
    return this.userRepository.save(user);
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { emailVerificationToken: token },
    });
  }
  

 async updateRefreshToken(user: User, refreshToken?: string|null) {
  if (refreshToken) {
    const salt = await bcrypt.genSalt();
    user.refreshToken = await bcrypt.hash(refreshToken, salt);
  } else {
    user.refreshToken = user.refreshToken ??null ;
  }

  return this.userRepository.save(user);
  }
}

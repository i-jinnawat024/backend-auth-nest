import { User } from '../entities/user.entity';

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByEmailVerificationToken(token: string): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: number): Promise<void>;
  findAll(): Promise<User[]>;
}

export const USER_REPOSITORY = Symbol('IUserRepository');
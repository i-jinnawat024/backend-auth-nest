import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IHashService } from '../../domain/services/hash.service.interface';

@Injectable()
export class HashService implements IHashService {
  async hash(plain: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(plain, salt);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
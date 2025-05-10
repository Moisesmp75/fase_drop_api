import * as bcrypt from 'bcrypt';
import { IHashingService } from '../../../domain/services/hashing.service';

export class HashingService implements IHashingService {
  private static readonly SALT_ROUNDS = 10;

  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, HashingService.SALT_ROUNDS);
  }

  public async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
} 
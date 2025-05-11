import * as bcrypt from 'bcryptjs';
import { IHashingService } from '../../../domain/services/hashing.service';

export class HashingService implements IHashingService {
  private static readonly SALT_ROUNDS = 10;

  public async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(HashingService.SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  }

  public async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
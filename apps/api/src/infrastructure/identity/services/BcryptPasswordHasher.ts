import { IPasswordHasher } from '../../application/identity/services/IPasswordHasher';
import * as bcrypt from 'bcrypt';

/**
 * Реализация хеширования паролей через bcrypt
 */
export class BcryptPasswordHasher implements IPasswordHasher {
  private readonly saltRounds = 10;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

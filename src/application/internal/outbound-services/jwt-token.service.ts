import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import { ITokenService } from '../../../domain/services/token.service';

interface DecodedToken {
  user_id: string;
  email: string;
  roles: number[];
}

export class JwtTokenService implements ITokenService {
  private readonly secretKey: string;
  private readonly expiresIn: number;

  constructor() {
    this.secretKey = process.env["JWT_SECRET_KEY"] || 'your-secret-key';
    this.expiresIn = parseInt(process.env["JWT_EXPIRES_IN"] || '86400');
  }

  public generateToken(userId: string, email: string, roles: number[]): string {
    const payload = {
      sub: userId,
      email: email,
      roles: roles
    };

    const options: SignOptions = {
      expiresIn: this.expiresIn
    };

    return jwt.sign(payload, this.secretKey, options);
  }

  public verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }

  validateToken(token: string): DecodedToken {
    try {
      const decoded = jwt.verify(token, this.secretKey) as any;
      return {
        user_id: decoded.sub,
        email: decoded.email,
        roles: decoded.roles
      };
    } catch (error) {
      return null;
    }
  }
} 
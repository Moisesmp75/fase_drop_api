
export interface ITokenService {
  generateToken(userId: string, email: string, roles: number[]): string;
  verifyToken(token: string): any;
} 
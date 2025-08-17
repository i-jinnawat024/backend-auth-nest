export interface TokenPayload {
  sub: number;
  username: string;
  roles: string[];
}

export interface ITokenService {
  generateAccessToken(payload: TokenPayload): Promise<string>;
  generateRefreshToken(userId: number): Promise<string>;
  verifyAccessToken(token: string): Promise<TokenPayload>;
  verifyRefreshToken(token: string): Promise<{ sub: number }>;
}

export const TOKEN_SERVICE = Symbol('ITokenService');
import { verifyEmailStatus } from 'src/core/enum/verifyEmailStatus';

export interface TokenPayload {
  id: string;
  email: string;
  username: string;
  deviceId: string;
  verifyStatus: verifyEmailStatus;
}
export interface TokenDecoded extends TokenPayload {
  iat: number;
  exp: number;
}
export interface CommonTokenPayload {
  email: string;
}
export interface CommonTokenDecode extends CommonTokenPayload {
  iat: number;
  exp: number;
}
export interface LoginMetaData {
  id: string;
  ipAddress: string;
  userAgent: string;
}

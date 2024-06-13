export interface TokenPayload {
  id: string;
  email: string;
  username: string;
  deviceId: string;
}
export interface TokenDecoded extends TokenPayload {
  iat: number;
  exp: number;
}
export interface ForgotPasswordTokenPayload {
  email: string;
}
export interface ForgotPasswordDecode extends ForgotPasswordTokenPayload {
  iat: number;
  exp: number;
}
export interface LoginMetaData {
  id: string;
  ipAddress: string;
  userAgent: string;
}

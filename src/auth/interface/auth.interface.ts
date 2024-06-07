export interface AccessTokenPayload {
  id: string;
  email: string;
  username: string;
}
export interface RefreshTokenPayload {
  id: string;
  username: string;
}
export interface LoginMetaData {
  id: string;
  ipAddress: string;
  userAgent: string;
}

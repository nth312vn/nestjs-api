export interface AccessTokenPayload {
  id: string;
  email: string;
  userName: string;
}
export interface RefreshTokenPayload {
  id: string;
  userName: string;
}
export interface LoginMetaData {
  id: string;
  ipAddress: string;
  userAgent: string;
}

export interface AccessTokenPayload {
  id: string;
  email: string;
  username: string;
  deviceId: string;
}
export interface RefreshTokenPayload {
  id: string;
  email: string;
  username: string;
  deviceId: string;
}
export interface LoginMetaData {
  id: string;
  ipAddress: string;
  userAgent: string;
}

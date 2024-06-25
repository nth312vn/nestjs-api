import { verifyEmailStatus } from 'src/core/enum/verifyEmailStatus';

export interface UserDecorator {
  id: string;
  email: string;
  username: string;
  deviceId: string;
  verifyStatus: verifyEmailStatus;
}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyEmailStatus } from 'src/core/enum/verifyEmailStatus';
import { UserDecorator } from 'src/user/interface/user.interface';

@Injectable()
export class VerifyAccountGuard implements CanActivate {
  isUserVerified(user: UserDecorator) {
    return user.verifyStatus === verifyEmailStatus.VERIFIED;
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const userInfo = request.user as UserDecorator;
    if (!this.isUserVerified(userInfo)) {
      throw new UnauthorizedException();
    }
    return true;
  }
}

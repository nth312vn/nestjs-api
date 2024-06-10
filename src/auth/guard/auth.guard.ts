import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
  private async validateRequest(request: Request): Promise<boolean> {
    try {
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        return false;
      }
      const payload = await this.tokenService.verifyAccessToken(token);
      if (request['fp'].id !== payload.deviceId) {
        throw new UnauthorizedException('Token not issued for this device');
      }
      request['user'] = payload;
      return true;
    } catch {
      return false;
    }
  }
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (!(await this.validateRequest(request))) {
      throw new UnauthorizedException();
    }
    return true;
  }
}

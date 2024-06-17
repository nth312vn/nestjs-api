import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDecorator } from 'src/user/interface/user.interface';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserDecorator;
  },
);

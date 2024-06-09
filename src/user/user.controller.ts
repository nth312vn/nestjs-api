import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  @Get()
  getMe(@Request() req: Request): string {
    console.log(req['user']);
    return 'hello';
  }
}

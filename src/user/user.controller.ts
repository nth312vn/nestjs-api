import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class UserController {
  @Get()
  hello(): string {
    return 'hello';
  }
}

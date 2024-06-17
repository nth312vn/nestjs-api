import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { User } from 'src/decorator/user.decorator';
import { UserService } from './user.service';
import { UserDecorator } from './interface/user.interface';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  async getMe(@User() user: UserDecorator) {
    const userInfo = await this.userService.getUserInfo({ id: user.id });
    return {
      username: userInfo.username,
      email: userInfo.email,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      dateOfBirth: userInfo.date_of_birth,
    };
  }
}

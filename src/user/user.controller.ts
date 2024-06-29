import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { User } from 'src/decorator/user.decorator';
import { UserService } from './user.service';
import { UserDecorator } from './interface/user.interface';
import { VerifyAccountGuard } from 'src/guard/verifyAccount.guard';
import { UpdateUserDto } from './dto/user.dto';

@Controller('user')
@UseGuards(AuthGuard, VerifyAccountGuard)
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  async getMe(@User() user: UserDecorator) {
    const userInfo = await this.userService.getUserInfo({ id: user.id });
    return {
      id: userInfo.id,
      username: userInfo.username,
      email: userInfo.email,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      dateOfBirth: userInfo.date_of_birth,
    };
  }
  @Patch('me')
  async updateMe(@Body() userDto: UpdateUserDto) {
    await this.userService.updateUser(userDto);
    return {
      message: 'update success',
    };
  }
}

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { User } from 'src/decorator/user.decorator';
import { UserService } from './user.service';
import { UserDecorator } from './interface/user.interface';
import { VerifyAccountGuard } from 'src/guard/verifyAccount.guard';
import { AddFollowerDto, GetFollowDto, UpdateUserDto } from './dto/user.dto';

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
  @Get('followers')
  async getFollowers(
    @User() user: UserDecorator,
    @Param() param: GetFollowDto,
  ) {
    const { page = 1, pageSize = 10 } = param;
    return await this.userService.getFollowers(user.id, page, pageSize);
  }
  @Get('following')
  async getFollowing(
    @User() user: UserDecorator,
    @Param() param: GetFollowDto,
  ) {
    const { page = 1, pageSize = 10 } = param;
    return await this.userService.getFollowing(user.id, page, pageSize);
  }
  @HttpCode(HttpStatus.CREATED)
  @Post('follow')
  async addFollower(@Body() body: AddFollowerDto) {
    await this.userService.addFollower(body.userId, body.followerId);
    return {
      message: 'add follower success',
    };
  }
}

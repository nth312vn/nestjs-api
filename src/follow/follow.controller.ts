import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guard/auth.guard';
import { VerifyAccountGuard } from 'src/guard/verifyAccount.guard';
import { FollowService } from './follow.service';
import { UserDecorator } from 'src/user/interface/user.interface';
import { User } from 'src/decorator/user.decorator';
import { AddFollowerDto, GetFollowDto } from './dto/follow.dto';

@Controller('follow')
@UseGuards(AuthGuard, VerifyAccountGuard)
export class FollowController {
  constructor(private followService: FollowService) {}
  @Get('followers')
  async getFollowers(
    @User() user: UserDecorator,
    @Param() param: GetFollowDto,
  ) {
    const { page = 1, pageSize = 10 } = param;
    return await this.followService.getFollowers(user.id, page, pageSize);
  }
  @Get('following')
  async getFollowing(
    @User() user: UserDecorator,
    @Param() param: GetFollowDto,
  ) {
    const { page = 1, pageSize = 10 } = param;
    return await this.followService.getFollowing(user.id, page, pageSize);
  }
  @HttpCode(HttpStatus.CREATED)
  @Post('follow')
  async addFollower(@Body() body: AddFollowerDto) {
    await this.followService.addFollower(body.userId, body.followerId);
    return {
      message: 'add follower success',
    };
  }
}

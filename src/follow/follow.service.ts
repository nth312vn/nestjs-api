import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core/base/baseService';
import { Follow } from 'src/entity/follow.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class FollowService extends BaseService<Follow> {
  constructor(
    @InjectRepository(Follow) private followRepository: Repository<Follow>,
    private userService: UserService,
  ) {
    super(followRepository);
  }
  async getFollowers(userId: string, page: number, pageSize: number) {
    const user = await this.userService.getUserInfo({
      id: userId,
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const [followers, total] = await this.followRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['follower'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return {
      data: followers.map((item) => ({
        id: item.id,
        email: item.follower.email,
        fistName: item.follower.firstName,
        lastName: item.follower.lastName,
        dateOfBirth: item.follower.date_of_birth,
        username: item.follower.username,
      })),
      total,
      page,
      pageSize,
    };
  }
  async addFollower(userId: string, followerId: string) {
    const user = await this.userService.getUserInfo({
      id: userId,
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const follower = await this.userService.getUserInfo({
      id: followerId,
    });
    if (!follower) {
      throw new NotFoundException('follower not found');
    }
    const existingFollower = await this.followRepository.findOne({
      where: {
        user: { id: userId },
        follower: { id: followerId },
      },
    });
    if (existingFollower) {
      throw new NotFoundException('follow already exists');
    }
    const newFollower = this.followRepository.create({
      user,
      follower: { id: followerId },
    });
    return await this.followRepository.save(newFollower);
  }
  async getFollowing(userId: string, page: number, pageSize: number) {
    const user = await this.userService.getUserInfo({
      id: userId,
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const [following, total] = await this.followRepository.findAndCount({
      where: { follower: { id: userId } },
      relations: ['user'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return {
      data: following.map((item) => ({
        id: item.id,
        email: item.user.email,
        fistName: item.user.firstName,
        lastName: item.user.lastName,
        dateOfBirth: item.user.date_of_birth,
        username: item.user.username,
      })),
      total,
      page,
      pageSize,
    };
  }
}

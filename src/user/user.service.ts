import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core/base/baseService';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { Follow } from 'src/entity/follow.entity';
import { isEmpty } from 'lodash';

@Injectable()
export class UserService extends BaseService<Users> {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
  ) {
    super(usersRepository);
  }
  createUser(user: UserDto) {
    return this.create(user);
  }

  getUserInfo(params: Partial<Users>) {
    return this.getOneByOptions({
      where: {
        ...params,
      },
    });
  }
  updateUser(entity: Partial<Users>) {
    if (isEmpty(entity)) {
      throw new NotFoundException('there is nothing to update');
    }
    return this.update(entity);
  }
  async ensureEmailIsCorrect(email: string) {
    const user = await this.getUserInfo({
      email,
    });
    if (!user) {
      throw new NotFoundException('email is invalid');
    }
    return user;
  }

  async getFollowers(userId: string, page: number, pageSize: number) {
    const user = await this.getUserInfo({
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
    console.log(followers);
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
    const user = await this.getUserInfo({
      id: userId,
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const follower = await this.getUserInfo({
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
    const user = await this.getUserInfo({
      id: userId,
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const [following, total] = await this.followRepository.findAndCount({
      where: { user: { id: userId } },
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

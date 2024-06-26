import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core/base/baseService';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { Follow } from 'src/entity/follow.entity';

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
    return this.update(entity);
  }
  async ensureEmailIsCorrect(email: string) {
    const user = await this.getOneByOptions({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('email is invalid');
    }
    return user;
  }

  async getFollowers(userId: string, page: number, pageSize: number) {
    const user = await this.getOneByOptions({
      where: {
        userId,
      },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const [followers, total] = await this.followRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['followers'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return {
      data: followers.map((item) => ({
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
  async addFollower(userId: string, followerId: string) {
    const user = await this.getOneByOptions({
      where: {
        userId,
      },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const follower = await this.getOneByOptions({
      where: {
        userId: followerId,
      },
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
    const user = await this.getOneByOptions({
      where: {
        userId,
      },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const [following, total] = await this.followRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['followings'],
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

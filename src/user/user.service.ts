import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core/base/baseService';
import { Users } from 'src/entity/user.entity';
import { In, Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { isEmpty } from 'lodash';
import { MinioClientService } from 'src/minio/minioClient.service';

@Injectable()
export class UserService extends BaseService<Users> {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private minioClientService: MinioClientService,
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
  async updateUserAvatar(id: string, avatarUrl: string) {
    const user = await this.getUserInfo({ id });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    if (user.avatar) {
      const { bucketName, objectName } =
        this.minioClientService.extractBucketAndObjectName(user.avatar);
      await this.minioClientService.deleteFile(bucketName, objectName);
    }
    await this.updateUser({ id, avatar: avatarUrl });
    return avatarUrl;
  }
  async getListMentions(userName: string[]) {
    return this.getManyByOptions({
      where: {
        username: In(userName),
      },
    });
  }
}

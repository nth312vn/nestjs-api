import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core/base/baseService';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService extends BaseService<Users> {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
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
}

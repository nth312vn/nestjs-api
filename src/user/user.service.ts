import { Injectable } from '@nestjs/common';
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

  getUserInfo(userName: string) {
    return this.getOneByOptions({
      where: {
        userName,
      },
    });
  }
}

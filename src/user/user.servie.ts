import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core/base/baseService';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService extends BaseService<Users> {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {
    super(usersRepository);
  }
}

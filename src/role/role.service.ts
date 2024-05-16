import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core/base/baseService';
import { Roles } from 'src/entity/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService extends BaseService<Roles> {
  constructor(
    @InjectRepository(Roles) private roleRepository: Repository<Roles>,
  ) {
    super(roleRepository);
  }
  findRole(roleName: string) {
    return this.getOneByOptions({ where: { name: roleName } });
  }
}

import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from 'src/entity/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Roles])],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}

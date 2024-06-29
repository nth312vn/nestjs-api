import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from 'src/entity/follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Follow]), UserModule],
  providers: [FollowService],
  controllers: [FollowController],
})
export class FollowModule {}

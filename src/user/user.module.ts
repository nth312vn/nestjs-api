import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entity/user.entity';
import { MinioClientModule } from 'src/minio/minioClient.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
  imports: [TypeOrmModule.forFeature([Users]), MinioClientModule],
})
export class UserModule {}

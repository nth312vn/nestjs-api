import { Module } from '@nestjs/common';
import { PasswordService } from './password/password.servicce';
import { ConfigModule } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [PasswordService],
  imports: [ConfigModule, UserService],
})
export class AuthModule {}

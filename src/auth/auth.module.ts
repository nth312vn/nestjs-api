import { Module } from '@nestjs/common';
import { PasswordService } from './password/password.service';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { RoleModule } from 'src/role/role.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoles } from 'src/entity/userRole.entity';
import { AuthController } from './auth.controller';
import { FingerPrintModule } from 'src/fingerPrint/fingerPrint.module';
import { DeviceSessionService } from './deviceSession/deviceSession.service';
import { DeviceSession } from 'src/entity/deviceSession.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    RoleModule,
    FingerPrintModule,
    TypeOrmModule.forFeature([UserRoles, DeviceSession]),
    FingerPrintModule,
    MailModule,
  ],
  providers: [PasswordService, AuthService, DeviceSessionService],
  controllers: [AuthController],
})
export class AuthModule {}

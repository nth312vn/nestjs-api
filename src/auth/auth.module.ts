import { Module } from '@nestjs/common';
import { PasswordService } from './password/password.service';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { RoleModule } from 'src/role/role.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoles } from 'src/entity/userRole.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { envKey } from 'src/core/config/envKey';
import { defaultConfig } from 'src/core/config/defaultConfig';
import { TokenService } from './token/token.service';
import { AuthController } from './auth.controller';
import { FingerPrintModule } from 'src/auth/deviceSession/fingerPrint/fingerPrint.module';
import { DeviceSessionService } from './deviceSession/deviceSession.service';
import { DeviceSession } from 'src/entity/deviceSession.entity';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    RoleModule,
    FingerPrintModule,
    TypeOrmModule.forFeature([UserRoles]),
    TypeOrmModule.forFeature([DeviceSession]),

    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(envKey.SECRET_KEY),
        signOptions: {
          expiresIn:
            configService.get<string>(envKey.TOKEN_EXPIRE_TIME) ||
            defaultConfig.tokenExpireTime,
        },
      }),
      inject: [ConfigService],
    }),
    FingerPrintModule,
  ],
  providers: [PasswordService, AuthService, TokenService, DeviceSessionService],
  controllers: [AuthController],
})
export class AuthModule {}

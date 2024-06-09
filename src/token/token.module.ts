import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { defaultConfig } from 'src/core/config/defaultConfig';
import { envKey } from 'src/core/config/envKey';
import { TokenService } from './token.service';
@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(envKey.ACCESS_TOKEN_SECRET_KEY),
        signOptions: {
          expiresIn:
            configService.get<string>(envKey.TOKEN_EXPIRE_TIME) ||
            defaultConfig.tokenExpireTime,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}

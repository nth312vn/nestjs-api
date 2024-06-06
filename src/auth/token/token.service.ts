import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { defaultConfig } from 'src/core/config/defaultConfig';
import { envKey } from 'src/core/config/envKey';
import { DeviceSession } from 'src/entity/deviceSession.entity';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from '../interface/auth.interface';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(DeviceSession)
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  generateAccessToken(payload: AccessTokenPayload) {
    return this.jwtService.signAsync(payload);
  }

  generateRefreshToken(payload: RefreshTokenPayload) {
    return this.jwtService.signAsync(payload, {
      expiresIn:
        this.configService.get<string>(envKey.REFRESH_TOKEN_EXPIRE_TIME) ||
        defaultConfig.refreshTokenExpireTime,
    });
  }
}

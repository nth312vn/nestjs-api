import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core/base/baseService';
import { defaultConfig } from 'src/core/config/defaultConfig';
import { envKey } from 'src/core/config/envKey';
import { Token } from 'src/entity/deviceSession.entity';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from '../interface/auth.interface';

@Injectable()
export class TokenService extends BaseService<Token> {
  constructor(
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    super(tokenRepository);
  }
  generateAccessToken(payload: AccessTokenPayload) {
    return this.jwtService.signAsync(payload);
  }
  saveRefreshToken(user: Users, token: string) {
    const data = this.tokenRepository.create({ user, token });
    return this.create(data);
  }
  generateRefreshToken(payload: RefreshTokenPayload) {
    return this.jwtService.signAsync(payload, {
      expiresIn:
        this.configService.get<string>(envKey.REFRESH_TOKEN_EXPIRE_TIME) ||
        defaultConfig.refreshTokenExpireTime,
    });
  }
  deleteRefreshToken(id: number) {
    return this.deleteById(id);
  }
  getRefreshTokenInfo(userId: number, token: string) {
    return this.getOneByOptions({
      where: {
        token,
        userId,
      },
    });
  }
}

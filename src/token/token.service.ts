import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ForgotPasswordDecode,
  ForgotPasswordTokenPayload,
  TokenDecoded,
  TokenPayload,
} from 'src/auth/interface/auth.interface';
import { defaultConfig } from 'src/core/config/defaultConfig';
import { envKey } from 'src/core/config/envKey';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  generateAccessToken(payload: TokenPayload) {
    return this.jwtService.signAsync(payload);
  }

  generateRefreshToken(payload: TokenPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>(envKey.REFRESH_TOKEN_SECRET_KEY),
      expiresIn: this.configService.get<string>(
        envKey.REFRESH_TOKEN_EXPIRE_TIME,
        defaultConfig.refreshTokenExpireTime,
      ),
    });
  }
  generateForgotPasswordToken(payload: ForgotPasswordTokenPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>(envKey.FORGOT_PASSWORD_SECRET_KEY),
      expiresIn: this.configService.get<string>(
        envKey.FORGOT_PASSWORD_TOKEN_EXPIRE_TIME,
        defaultConfig.forgotPasswordTokenExpireTime,
      ),
    });
  }
  async generate(payload: TokenPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);
    return [accessToken, refreshToken];
  }
  async verifyAccessToken(token: string): Promise<TokenDecoded> {
    return await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>(envKey.ACCESS_TOKEN_SECRET_KEY),
    });
  }
  async verifyRefreshToken(token: string): Promise<TokenDecoded> {
    return await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>(envKey.REFRESH_TOKEN_SECRET_KEY),
    });
  }
  async verifyForgotPasswordToken(
    token: string,
  ): Promise<ForgotPasswordDecode> {
    return await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>(envKey.FORGOT_PASSWORD_SECRET_KEY),
    });
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { defaultConfig } from 'src/core/config/defaultConfig';
import { envKey } from 'src/core/config/envKey';
@Injectable()
export class PasswordService {
  constructor(private configService: ConfigService) {}
  hashPassword(password: string) {
    return bcrypt.hash(
      password,
      this.configService.get(envKey.SALT_ROUND) || defaultConfig.saltRound,
    );
  }
  isMatchPassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }
}

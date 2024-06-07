import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash, compare } from 'bcrypt';
import { defaultConfig } from 'src/core/config/defaultConfig';
import { envKey } from 'src/core/config/envKey';
@Injectable()
export class PasswordService {
  constructor(private configService: ConfigService) {}
  async hashPassword(password: string) {
    return await hash(
      password,
      this.configService.get(envKey.SALT_ROUND)
        ? Number(this.configService.get(envKey.SALT_ROUND))
        : defaultConfig.saltRound,
    );
  }
  isMatchPassword(password: string, hashedPassword: string) {
    return compare(password, hashedPassword);
  }
}

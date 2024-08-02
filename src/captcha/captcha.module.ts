import { Module } from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { CaptchaController } from './captcha.controller';
import { RedisConfigModule } from 'src/redisConfig/redisConfig.module';

@Module({
  imports: [RedisConfigModule],
  providers: [CaptchaService],
  controllers: [CaptchaController],
  exports: [CaptchaService],
})
export class CaptchaModule {}

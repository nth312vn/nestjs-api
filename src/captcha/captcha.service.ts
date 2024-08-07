import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CaptchaGenerator } from 'captcha-canvas';
import { Cache } from 'cache-manager';
import { generateCaptchaText } from 'src/utils/captcha';
import { captchaPrefix } from 'src/core/constant/redisPrefix.constant';
import { getRandomColor } from 'src/utils/color';

@Injectable()
export class CaptchaService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async generateCaptcha() {
    const captcha = new CaptchaGenerator({ height: 200, width: 600 });
    captcha.setCaptcha({
      text: generateCaptchaText(),
      size: 60,
      color: getRandomColor(),
    });
    captcha.setDecoy({ opacity: 0.5 });
    captcha.setTrace({ color: getRandomColor() });
    const buffer = await captcha.generate();
    const id = `${captchaPrefix}${uuid()}`;
    await this.cacheManager.set(id, captcha.text, 50000);
    return { id, buffer };
  }
  async validateCaptcha(id: string, userInput: string): Promise<boolean> {
    const storedCaptcha = await this.cacheManager.get<string>(id);
    console.log(storedCaptcha, userInput);
    const result =
      userInput &&
      storedCaptcha &&
      userInput.toLowerCase() === storedCaptcha.toLowerCase();
    if (result) await this.cacheManager.del(id);
    return result;
  }
}

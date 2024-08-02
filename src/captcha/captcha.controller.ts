import { Controller, Get, Res } from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { Response } from 'express';

@Controller('captcha')
export class CaptchaController {
  constructor(private captchaService: CaptchaService) {}
  @Get('generate')
  async generateCaptcha(@Res() res: Response) {
    const { id, buffer } = await this.captchaService.generateCaptcha();
    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': 'inline',
      'Captcha-ID': id,
    });
    return res.send(buffer);
  }
}

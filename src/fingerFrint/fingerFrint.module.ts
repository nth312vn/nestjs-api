import { Module } from '@nestjs/common';
import { NestjsFingerprintModule } from 'nestjs-fingerprint';

@Module({
  imports: [
    NestjsFingerprintModule.forRoot({
      params: ['headers', 'userAgent', 'ipAddress'],
      cookieOptions: {
        name: 'your_cookie_name', // optional
        httpOnly: true, // optional
      },
    }),
  ],
  exports: [FingerprintModule],
})
export class FingerprintModule {}

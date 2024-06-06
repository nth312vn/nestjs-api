import { Module } from '@nestjs/common';
import { NestjsFingerprintModule } from 'nestjs-fingerprint';

@Module({
  imports: [
    NestjsFingerprintModule.forRoot({
      params: ['headers', 'userAgent', 'ipAddress'],
    }),
  ],
  exports: [FingerPrintModule],
})
export class FingerPrintModule {}

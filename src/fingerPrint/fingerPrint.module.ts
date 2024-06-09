import { Global, Module } from '@nestjs/common';
import { NestjsFingerprintModule } from 'nestjs-fingerprint';
@Global()
@Module({
  imports: [
    NestjsFingerprintModule.forRoot({
      params: ['headers', 'userAgent', 'ipAddress'],
    }),
  ],
  exports: [FingerPrintModule],
})
export class FingerPrintModule {}

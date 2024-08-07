import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          keyPrefix: 'queue',
          defaultJobOptions: {
            removeOnSuccess: true,
            removeOnFail: true,
          },
        },
      }),
    }),
  ],
})
export class QueueModule {}

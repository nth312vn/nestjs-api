import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { MinioClientModule } from 'src/minio/minioClient.module';
import { VideoService } from './video.service';

@Module({
  imports: [MinioClientModule],
  providers: [VideoService],
  controllers: [VideoController],
})
export class VideoModule {}

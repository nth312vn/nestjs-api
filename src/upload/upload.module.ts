import { Module } from '@nestjs/common';

import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { MinioClientModule } from 'src/minio/minioClient.module';

@Module({
  imports: [MinioClientModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}

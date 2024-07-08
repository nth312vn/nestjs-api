import { Module } from '@nestjs/common';

import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { MinioClientModule } from 'src/minio/minioClient.module';
import { UserModule } from 'src/user/user.module';
import { ImageModule } from 'src/image/image.module';

@Module({
  imports: [MinioClientModule, UserModule, ImageModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}

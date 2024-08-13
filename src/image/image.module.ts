import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { MinioClientModule } from 'src/minio/minioClient.module';
import { ImageController } from './image.controller';

@Module({
  imports: [MinioClientModule],
  providers: [ImageService],
  exports: [ImageService],
  controllers: [ImageController],
})
export class ImageModule {}

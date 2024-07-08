import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { minioConfig } from 'src/core/config/minio.config';
import { MinioClientService } from 'src/minio/minioClient.service';

@Injectable()
export class UploadService {
  constructor(private minioClientService: MinioClientService) {}
  handleUploadFile(file: Express.Multer.File, bucket: string) {
    const fileName =
      crypto.randomBytes(16).toString('hex') + '-' + file.originalname;

    return this.minioClientService.uploadFile(file.buffer, bucket, fileName);
  }

  handleUploadAvatar(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.handleUploadFile(file, minioConfig.avatarBucket);
  }
}

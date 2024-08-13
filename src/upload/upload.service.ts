import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { minioConfig } from 'src/core/config/minio.config';
import { ImageService } from 'src/image/image.service';
import { MinioClientService } from 'src/minio/minioClient.service';
import { UserDecorator } from 'src/user/interface/user.interface';
import { UserService } from 'src/user/user.service';
import { getFileExtension } from 'src/utils/binary';

@Injectable()
export class UploadService {
  constructor(
    private minioClientService: MinioClientService,
    private userService: UserService,
    private imageService: ImageService,
  ) {}
  async handleUploadImage(
    file: Express.Multer.File,
    bucket: string,
    buffer?: Buffer,
  ) {
    const ext = getFileExtension(buffer ?? file.buffer, file.originalname);
    const fileName = `${crypto.randomBytes(16).toString('hex')}.${ext}`;

    return this.minioClientService.uploadFile(
      buffer ?? file.buffer,
      bucket,
      fileName,
      {
        'Content-Type': 'image/jpeg',
      },
    );
  }

  async handleUploadAvatar(
    file: Express.Multer.File,
    user: UserDecorator,
    host: string,
  ) {
    const compressBuffer = await this.imageService.compressImage(file.buffer);
    const url = await this.handleUploadImage(
      file,
      minioConfig.avatarBucket,
      compressBuffer,
    );
    const avatarUrl = `${host}/api/image/${minioConfig.avatarBucket}/${url}`;

    await this.userService.updateUserAvatar(user.id, avatarUrl);
    return avatarUrl;
  }
  async handleUploadVideo(
    file: Express.Multer.File,
    bucket: string,
    host: string,
  ) {
    const ext = getFileExtension(file.buffer, file.originalname);
    const fileName = `${crypto.randomBytes(16).toString('hex')}.${ext}`;
    const url = await this.minioClientService.uploadFile(
      file.buffer,
      bucket,
      fileName,
      {
        'Content-Type': 'video/mp4',
      },
    );
    return `${host}/api/videos/${bucket}/${url}`;
  }
}

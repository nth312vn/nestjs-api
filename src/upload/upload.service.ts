import { BadRequestException, Injectable } from '@nestjs/common';
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
    const ext = getFileExtension(buffer ?? file.buffer);
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

  async handleUploadAvatar(file: Express.Multer.File, user: UserDecorator) {
    const compressBuffer = await this.imageService.compressImage(file.buffer);
    const url = await this.handleUploadImage(
      file,
      minioConfig.avatarBucket,
      compressBuffer,
    );
    const avatarUrl = await this.minioClientService.getFileUrl(
      url,
      minioConfig.avatarBucket,
    );

    await this.userService.updateUserAvatar(user.id, avatarUrl);
    return avatarUrl;
  }
}

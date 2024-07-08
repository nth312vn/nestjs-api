import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { minioConfig } from 'src/core/config/minio.config';
import { ImageService } from 'src/image/image.service';
import { MinioClientService } from 'src/minio/minioClient.service';
import { UserDecorator } from 'src/user/interface/user.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UploadService {
  constructor(
    private minioClientService: MinioClientService,
    private userService: UserService,
    private imageService: ImageService,
  ) {}
  handleUploadFile(file: Express.Multer.File, bucket: string, buffer?: Buffer) {
    const fileName =
      crypto.randomBytes(16).toString('hex') + '-' + file.originalname;

    return this.minioClientService.uploadFile(
      buffer ?? file.buffer,
      bucket,
      fileName,
    );
  }

  async handleUploadAvatar(file: Express.Multer.File, user: UserDecorator) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const compressBuffer = await this.imageService.compressImage(file.buffer);
    const url = await this.handleUploadFile(
      file,
      minioConfig.avatarBucket,
      compressBuffer,
    );
    const avatarUrl = await this.minioClientService.getFileUrl(
      url,
      minioConfig.avatarBucket,
    );
    await this.userService.updateUser({
      id: user.id,
      avatar: avatarUrl,
    });
    return avatarUrl;
  }
}

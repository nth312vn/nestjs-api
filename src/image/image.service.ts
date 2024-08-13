import { Injectable, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import * as sharp from 'sharp';
import { MinioClientService } from 'src/minio/minioClient.service';

@Injectable()
export class ImageService {
  constructor(private minioClientService: MinioClientService) {}
  async compressImage(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer).jpeg({ quality: 70 }).toBuffer();
  }
  async getSingleImage(bucketName: string, objectName: string, res: Response) {
    try {
      const image = await this.minioClientService.getObjectStream(
        bucketName,
        objectName,
      );
      image.pipe(res);
    } catch {
      throw new NotFoundException('image not found');
    }
  }
  async getMultipleImages(bucketName: string, objectNames: string[]) {
    try {
      console.log(objectNames);
      const images = await this.minioClientService.getMultipleObjects(
        bucketName,
        objectNames,
      );
      return images;
    } catch {
      throw new NotFoundException('image not found');
    }
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { minioConfig } from 'src/core/config/minio.config';
import { ConfigService } from '@nestjs/config';
import { ItemBucketMetadata, RemoveOptions } from 'minio';
@Injectable()
export class MinioClientService {
  private readonly baseBucket = minioConfig.baseBucket;
  constructor(
    private minio: MinioService,
    private configService: ConfigService,
  ) {}
  get() {
    return this.minio.client;
  }
  async uploadFile(
    file: Buffer,
    bucket: string = this.baseBucket,
    fileName: string,
    metaData?: ItemBucketMetadata,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    try {
      await this.get().putObject(bucket, fileName, file, metaData);
      return fileName;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
  async getFileUrl(fileName: string, bucket: string = this.baseBucket) {
    return await this.get().presignedUrl('GET', bucket, fileName);
  }
  async deleteFile(
    bucketName: string,
    fileName: string,
    options?: RemoveOptions,
  ): Promise<void> {
    return this.get().removeObject(bucketName, fileName, options);
  }
  extractBucketAndObjectName(url: string) {
    const urlParts = new URL(url);
    const pathParts = urlParts.pathname.split('/').filter((part) => part);

    if (pathParts.length < 2) {
      throw new Error('Invalid URL format');
    }

    const bucketName = pathParts[0];
    const objectName = pathParts.slice(1).join('/');

    return { bucketName, objectName };
  }
}

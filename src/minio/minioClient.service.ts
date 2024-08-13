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
  async getObjectStream(bucketName: string, objectName: string) {
    return this.get().getObject(bucketName, objectName);
  }
  getSizeObject(bucketName: string, objectName: string) {
    return this.get().statObject(bucketName, objectName);
  }
  async getObject(bucketName: string, objectName: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      this.get().getObject(bucketName, objectName, (err, dataStream) => {
        if (err) {
          return reject(err);
        }

        const chunks: Buffer[] = [];
        dataStream.on('data', (chunk) => {
          chunks.push(chunk);
        });

        dataStream.on('end', () => {
          resolve(Buffer.concat(chunks));
        });

        dataStream.on('error', (err) => {
          reject(err);
        });
      });
    });
  }
  async getMultipleObjects(bucketName: string, objectNames: string[]) {
    const result: Record<string, Buffer> = {};
    console.log(objectNames);
    for (const objectName of objectNames) {
      result[objectName] = await this.getObject(bucketName, objectName);
    }

    return result;
  }
}

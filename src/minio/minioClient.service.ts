import { BadRequestException, Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { minioConfig } from 'src/core/config/minio.config';
import { ConfigService } from '@nestjs/config';

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
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    try {
      await this.get().putObject(bucket, fileName, file);
      return {
        url: `${this.configService.get('MINIO_ENDPOINT')}:${this.configService.get('MINIO_PORT')}/${this.configService.get('MINIO_BUCKET')}/${fileName}`,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}

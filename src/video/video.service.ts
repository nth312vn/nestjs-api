import { HttpStatus, Injectable } from '@nestjs/common';
import { MinioClientService } from 'src/minio/minioClient.service';
import { Request, Response } from 'express';

@Injectable()
export class VideoService {
  constructor(private minioClientService: MinioClientService) {}
  async sendVideo(
    bucketName: string,
    objectName: string,
    request: Request,
    response: Response,
  ) {
    const videoSize = await this.minioClientService.getSizeObject(
      bucketName,
      objectName,
    );
    const CHUNK_SIZE = 10 ** 6;

    const requestedRange = request.headers.range || '';
    const start = Number(requestedRange.replace(/\\\\D/g, ''));
    const end = Math.min(start + CHUNK_SIZE, videoSize.size - 1);
    const contentLength = end - start + 1;
    const headers = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',

      'Content-Length': contentLength,
      'Content-Type': 'video/mp4',
    };
    response.writeHead(HttpStatus.PARTIAL_CONTENT, headers);
    const videoStream = await this.minioClientService.getObjectStream(
      bucketName,
      objectName,
    );
    videoStream.pipe(response);
  }
}

import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { VideoService } from './video.service';

@Controller('videos')
export class VideoController {
  constructor(private videoService: VideoService) {}
  @Get(':bucketName/:objectName')
  async getVideo(
    @Param('bucketName') bucketName: string,
    @Param('objectName') objectName: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.videoService.sendVideo(bucketName, objectName, req, res);
  }
}

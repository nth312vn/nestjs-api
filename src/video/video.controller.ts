import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { VideoService } from './video.service';
import { GetVideoDto } from './dto/video.dto';

@Controller('videos')
export class VideoController {
  constructor(private videoService: VideoService) {}
  @Get(':bucketName/:objectName')
  async getVideo(
    @Param() param: GetVideoDto,

    @Res() res: Response,
    @Req() req: Request,
  ) {
    const { bucketName, objectName } = param;
    return this.videoService.sendVideo(bucketName, objectName, req, res);
  }
}

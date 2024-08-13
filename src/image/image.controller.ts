import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ImageService } from './image.service';
import { Response } from 'express';
import {
  BucketDto,
  GetMultipleImageQueryDto,
  GetSingleImageDto,
} from './dto/image.dto';

@Controller('image')
export class ImageController {
  constructor(private imageService: ImageService) {}
  @Get('multi/:bucketName')
  async getMultiImages(
    @Param() params: BucketDto,
    @Query() query: GetMultipleImageQueryDto,
    @Res() res: Response,
  ) {
    const { bucketName } = params;
    const { images } = query;
    const result = await this.imageService.getMultipleImages(
      bucketName,
      images,
    );
    res.setHeader('Content-Type', 'application/json');
    return res.send({ data: result });
  }
  @Get(':bucketName/:objectName')
  getSingleImage(
    @Param() params: GetSingleImageDto,

    @Res() res: Response,
  ) {
    const { bucketName, objectName } = params;
    return this.imageService.getSingleImage(bucketName, objectName, res);
  }
}

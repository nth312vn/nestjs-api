import {
  BadGatewayException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { User } from 'src/decorator/user.decorator';
import { UserDecorator } from 'src/user/interface/user.interface';
import { AuthGuard } from 'src/guard/auth.guard';
import { VerifyAccountGuard } from 'src/guard/verifyAccount.guard';
import { minioConfig } from 'src/core/config/minio.config';
import { Request } from 'express';
import * as url from 'url';
@Controller('upload')
@UseGuards(AuthGuard, VerifyAccountGuard)
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: (req, file, cb) => {
        if (
          !file.originalname.match(/\.(jpg|jpeg|png|gif)$/) ||
          !file.mimetype.match(/^image/)
        ) {
          return cb(
            new BadGatewayException('Only image files are allowed!'),
            false,
          );
        }

        cb(null, true);
      },
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @User() user: UserDecorator,
    @Req() req: Request,
  ) {
    return this.uploadService.handleUploadAvatar(
      file,
      user,
      url.format({
        protocol: req.protocol,
        host: req.get('host'),
      }),
    );
  }

  @Post('video')
  @UseInterceptors(
    FileInterceptor('video', {
      fileFilter: (req, file, cb) => {
        if (
          !file.originalname.match(/\.(mp4)$/) ||
          !file.mimetype.match(/^video/)
        ) {
          return cb(
            new BadGatewayException('Only video files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 100 * 1024 * 1024 },
    }),
  )
  uploadVideo(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.uploadService.handleUploadVideo(
      file,
      minioConfig.videoBucket,
      url.format({
        protocol: req.protocol,
        host: req.get('host'),
      }),
    );
  }
}

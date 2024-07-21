import {
  BadGatewayException,
  Controller,
  Post,
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
import { FileCount } from 'src/interceptor/file.interceptor';
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
    FileCount(1),
  )
  uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @User() user: UserDecorator,
  ) {
    return this.uploadService.handleUploadAvatar(file, user);
  }
}

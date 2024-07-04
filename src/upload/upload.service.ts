import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  handleUploadFile(file: Express.Multer.File) {
    console.log(file);
    return file;
  }

  handleUploadAvatar(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return file;
  }
}

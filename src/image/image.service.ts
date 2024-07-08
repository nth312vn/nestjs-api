import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class ImageService {
  async compressImage(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer).jpeg({ quality: 70 }).toBuffer();
  }
}

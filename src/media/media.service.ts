import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core/base/baseService';
import { Media } from 'src/entity/media';
import { Repository } from 'typeorm';
import { MediaDto } from './dto/media.dto';

@Injectable()
export class MediaService extends BaseService<Media> {
  constructor(
    @InjectRepository(Media) private mediaRepository: Repository<Media>,
  ) {
    super(mediaRepository);
  }

  async getMediaByPostId(postId: string) {
    return await this.getManyByOptions({ where: { post: { id: postId } } });
  }
  async deleteMediaByPostId(postId: string) {
    await this.mediaRepository.delete({ post: { id: postId } });
  }
  async createMedia(media: Media) {
    return await this.create(media);
  }
  async updateMedia(media: Partial<MediaDto>) {
    return await this.update(media);
  }
}

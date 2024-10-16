import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core/base/baseService';
import { Media } from 'src/entity/media';
import { EntityManager, Repository } from 'typeorm';
import { MediaDto } from './dto/media.dto';
import { Post } from 'src/entity/post.entity';

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
  createMediaEntities(medias: Partial<Media>[], manager: EntityManager) {
    const mediaEntities = this.mediaRepository.create(medias);
    return manager.save(Media, mediaEntities);
  }
  async updateMedia(media: Partial<MediaDto>) {
    return await this.update(media);
  }
  async updatePostMedias(
    post: Post,
    updatedMedias: Partial<MediaDto>[],
    manager: EntityManager,
  ) {
    const existingMediaMap = new Map(post.media.map((m) => [m.url, m]));
    const updatedMedia = [];
    const mediaToRemove = [];
    updatedMedias.forEach((newMedia) => {
      const existingMedia = existingMediaMap.get(newMedia.url);
      if (existingMedia) {
        updatedMedia.push(existingMedia);
        existingMediaMap.delete(newMedia.url);
      } else {
        const newMediaEntity = manager.create(Media, {
          url: newMedia.url,
          type: newMedia.type,
          post: post,
        });
        updatedMedia.push(newMediaEntity);
      }
    });
    mediaToRemove.push(...existingMediaMap.values());
    if (mediaToRemove.length > 0) {
      await manager.remove(mediaToRemove);
    }
    if (updatedMedia.length > 0) {
      await manager.save(updatedMedia);
    }
    return updatedMedia;
  }
}

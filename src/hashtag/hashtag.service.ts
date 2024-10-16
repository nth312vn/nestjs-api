import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core/base/baseService';
import { Hashtag } from 'src/entity/hashtag.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class HashtagService extends BaseService<Hashtag> {
  constructor(
    @InjectRepository(Hashtag) private hashtagRepository: Repository<Hashtag>,
  ) {
    super(hashtagRepository);
  }
  createHashtag(hashtag: string, manager: EntityManager) {
    const newHashtag = manager.create(Hashtag, { name: hashtag });
    return manager.save(newHashtag);
  }
  async findOneOrInsertHashTag(tag: string, manager: EntityManager) {
    const hashtag = await this.hashtagRepository.findOne({
      where: { name: tag },
    });
    if (!hashtag) {
      return this.createHashtag(tag, manager);
    }
    return hashtag;
  }
}

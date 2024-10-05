import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core/base/baseService';
import { Hashtag } from 'src/entity/hashtag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HashtagService extends BaseService<Hashtag> {
  constructor(
    @InjectRepository(Hashtag) private hashtagRepository: Repository<Hashtag>,
  ) {
    super(hashtagRepository);
  }
  createHashtag(hashtag: string) {
    return this.create({ name: hashtag });
  }
  async findOneOrInsertHashTag(tag: string) {
    const hashtag = await this.hashtagRepository.findOne({
      where: { name: tag },
    });
    if (!hashtag) {
      return await this.createHashtag(tag);
    }
    return hashtag;
  }
}

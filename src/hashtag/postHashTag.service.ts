import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core/base/baseService';
import { Hashtag } from 'src/entity/hashtag.entity';
import { Post } from 'src/entity/post.entity';
import { PostHashtag } from 'src/entity/postHastag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostHashTagService extends BaseService<PostHashtag> {
  constructor(
    @InjectRepository(PostHashtag)
    private postHashtagRepository: Repository<PostHashtag>,
  ) {
    super(postHashtagRepository);
  }

  createPostHashtag(post: Post, hashtag: Hashtag) {
    return this.postHashtagRepository.create({ post, hashtag });
  }
}

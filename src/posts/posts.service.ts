import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/posts.dto';
import { BaseService } from 'src/core/base/baseService';
import { Post } from 'src/entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostService extends BaseService<Post> {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {
    super(postRepository);
  }
  createPost(createPostDto: CreatePostDto) {}
  private extractHashtags(content: string): string[] {
    return content.match(/#\w+/g)?.map((tag) => tag.slice(1)) || [];
  }

  private extractMentions(content: string): string[] {
    return content.match(/@\w+/g)?.map((mention) => mention.slice(1)) || [];
  }
}

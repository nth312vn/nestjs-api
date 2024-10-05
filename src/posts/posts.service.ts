import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base/baseService';
import { Post } from 'src/entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/posts.dto';
import { PostHashTagService } from 'src/hashtag/postHashTag.service';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { UserService } from 'src/user/user.service';
import { MediaService } from 'src/media/media.service';

@Injectable()
export class PostService extends BaseService<Post> {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private postHashTagService: PostHashTagService,
    private hashtagService: HashtagService,
    private userService: UserService,
    private mediaService: MediaService,
  ) {
    super(postRepository);
  }
  async createPost(createPostDto: CreatePostDto) {
    const { content, media, type } = createPostDto;
    const hashtags = this.extractHashtags(content);
    const mentions = this.extractMentions(content);
    const post = this.postRepository.create({ content, postType: type });
    const postHashtags = await Promise.all(
      hashtags.map(async (hashtag) => {
        const hashTag =
          await this.hashtagService.findOneOrInsertHashTag(hashtag);
        return this.postHashTagService.createPostHashtag(post, hashTag);
      }),
    );
    post.postHashtag = postHashtags;
    const mentionEntities = await this.userService.getListMentions(mentions);
    post.mention = mentionEntities;
    if (media) {
      const mediaEntities = this.mediaService.createMediaEntities(media);
      post.media = mediaEntities;
      return this.postRepository.save(post);
    }
    return this.create(post);
  }
  private extractHashtags(content: string): string[] {
    return content.match(/#\w+/g)?.map((tag) => tag.slice(1)) || [];
  }

  private extractMentions(content: string): string[] {
    return content.match(/@\w+/g)?.map((mention) => mention.slice(1)) || [];
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/core/base/baseService';
import { Post } from 'src/entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto, UpdatePostDto } from './dto/posts.dto';
import { PostHashTagService } from 'src/hashtag/postHashTag.service';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { UserService } from 'src/user/user.service';
import { MediaService } from 'src/media/media.service';
import { isEmpty } from 'class-validator';
import { UserDecorator } from 'src/user/interface/user.interface';

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
    const { content, media, type, userId } = createPostDto;
    const hashtags = this.extractHashtags(content);
    const mentions = this.extractMentions(content);
    const author = await this.ensureAuthorExist(userId);

    const post = this.postRepository.create({
      content,
      postType: type,
      author,
    });
    if (!isEmpty(hashtags)) {
      const postHashtags = await Promise.all(
        hashtags.map(async (hashtag) => {
          const hashTag =
            await this.hashtagService.findOneOrInsertHashTag(hashtag);
          return this.postHashTagService.createPostHashtag(post, hashTag);
        }),
      );
      post.postHashtag = postHashtags;
    }
    if (!isEmpty(mentions)) {
      const mentionEntities = await this.userService.getListMentions(mentions);
      post.mention = mentionEntities;
    }
    if (media) {
      const mediaEntities = this.mediaService.createMediaEntities(media);
      post.media = mediaEntities;
    }
    await this.create(post);
    return 'created success';
  }

  async updatePosts(
    updatePostDto: UpdatePostDto,
    id: string,
    user: UserDecorator,
  ) {
    const { content, media, type } = updatePostDto;
    const hashtags = this.extractHashtags(content);
    const mentions = this.extractMentions(content);

    const post = await this.getOneByOptions({
      where: { id, author: { id: user.id } },
      relations: ['postHashtag', 'mention', 'media', 'author'],
    });
    post.content = content || post.content;
    post.postType = type || post.postType;
    if (!isEmpty(hashtags)) {
      const postHashtags = await Promise.all(
        hashtags.map(async (hashtag) => {
          const hashTag =
            await this.hashtagService.findOneOrInsertHashTag(hashtag);
          return this.postHashTagService.createPostHashtag(post, hashTag);
        }),
      );
      post.postHashtag = postHashtags;
    }
    if (!isEmpty(mentions)) {
      const mentionEntities = await this.userService.getListMentions(mentions);
      post.mention = mentionEntities;
    }
    if (media) {
      const mediaEntities = this.mediaService.createMediaEntities(media);
      post.media = mediaEntities;
    }
    await this.update(post);
    return 'update success';
  }
  getPostDetail(id: string) {
    return this.getOneByOptions({
      where: { id },
      relations: ['postHashtag', 'mention', 'media', 'author'],
    });
  }
  async getListPostsByAuthorId(
    user: UserDecorator,
    page: number,
    pageSize: number,
  ) {
    const author = await this.ensureAuthorExist(user.id);
    const [posts, total] = await this.postRepository.findAndCount({
      where: { author },
      relations: ['postHashtag', 'mention', 'media', 'author'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return {
      data: posts,
      total,
      page,
      pageSize,
    };
  }
  deletePost(id: string, user: UserDecorator) {
    return this.postRepository.delete({
      id,
      author: { id: user.id },
    });
  }
  async ensureAuthorExist(id: string) {
    const user = await this.userService.getOneByOptions({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }
  private extractHashtags(content: string): string[] {
    return content.match(/#\w+/g)?.map((tag) => tag.slice(1)) || [];
  }

  private extractMentions(content: string): string[] {
    return content.match(/@\w+/g)?.map((mention) => mention.slice(1)) || [];
  }
}

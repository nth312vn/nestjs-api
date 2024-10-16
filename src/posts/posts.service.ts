import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/core/base/baseService';
import { Post } from 'src/entity/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { CreatePostDto, SearchPostsDto, UpdatePostDto } from './dto/posts.dto';
import { UserService } from 'src/user/user.service';
import { MediaService } from 'src/media/media.service';
import { isEmpty } from 'class-validator';
import { UserDecorator } from 'src/user/interface/user.interface';
import { HashtagService } from 'src/hashtag/hashtag.service';
import { postType } from 'src/core/enum/postType';

@Injectable()
export class PostService extends BaseService<Post> {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private userService: UserService,
    private mediaService: MediaService,
    private hashtagService: HashtagService,
    private dataSource: DataSource,
  ) {
    super(postRepository);
  }
  async createPost(createPostDto: CreatePostDto) {
    const { content, media, type, userId } = createPostDto;
    const hashtags = this.extractHashtags(content);
    const mentions = this.extractMentions(content);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { manager } = queryRunner;
      const author = await this.ensureAuthorExist(userId);

      const post = this.postRepository.create({
        content,
        postType: type,
        author,
      });
      if (!isEmpty(hashtags)) {
        const hashTags = await Promise.all(
          hashtags.map(async (hashtag) => {
            return this.hashtagService.findOneOrInsertHashTag(hashtag, manager);
          }),
        );
        post.hashtags = hashTags;
      }
      if (!isEmpty(mentions)) {
        const mentionEntities =
          await this.userService.getListMentions(mentions);
        post.mention = mentionEntities;
      }
      if (!isEmpty(media)) {
        const mediaEntities = await this.mediaService.createMediaEntities(
          media,
          manager,
        );
        post.media = mediaEntities;
      }
      await manager.save(post);
      await queryRunner.commitTransaction();
      return 'created success';
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new NotFoundException('something went wrong');
    } finally {
      await queryRunner.release();
    }
  }

  async updatePosts(
    updatePostDto: UpdatePostDto,
    id: string,
    user: UserDecorator,
  ) {
    const { content, media, type } = updatePostDto;
    const hashtags = this.extractHashtags(content);
    const mentions = this.extractMentions(content);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { manager } = queryRunner;
      const post = await this.getOneByOptions({
        where: { id, author: { id: user.id } },
        relations: ['hashtags', 'mention', 'media', 'author'],
      });
      post.content = content || post.content;
      post.postType = type || post.postType;

      const hashTags = await Promise.all(
        hashtags.map(async (hashtag) => {
          return this.hashtagService.findOneOrInsertHashTag(hashtag, manager);
        }),
      );
      post.hashtags = hashTags;
      const mentionEntities = await this.userService.getListMentions(mentions);
      post.mention = mentionEntities;
      post.media = await this.mediaService.updatePostMedias(
        post,
        media,
        manager,
      );
      await manager.save(post);
      await queryRunner.commitTransaction();
      return 'update success';
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new NotFoundException('something went wrong', e.message);
    } finally {
      await queryRunner.release();
    }
  }
  async getPostDetail(id: string) {
    const post = await this.getOneByOptions({
      where: { id },
      relations: ['hashtags', 'mention', 'media', 'author'],
    });
    if (!post) {
      throw new NotFoundException('post not found');
    }
    return {
      id: post.id,
      type: post.postType,
      content: post.content,
      author: {
        id: post.author.id,
        name: post.author.username,
      },
      postHashtag: post.hashtags.map((tag) => ({
        id: tag.id,
        name: tag.name,
      })),
      mention: post.mention.map((m) => ({
        id: m.id,
        name: m.username,
      })),
      media: post.media.map((m) => ({
        id: m.id,
        url: m.url,
      })),
    };
  }
  async getListPostsByAuthorId(
    user: UserDecorator,
    page: number,
    pageSize: number,
  ) {
    const author = await this.ensureAuthorExist(user.id);
    const [posts, total] = await this.postRepository.findAndCount({
      where: { author: { id: author.id } },
      relations: ['hashtags', 'mention', 'media', 'author'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    if (!posts || posts.length === 0) {
      throw new NotFoundException('post not found');
    }
    const transformedPosts = posts.map((post) => ({
      id: post.id,
      type: post.postType,
      content: post.content,
      author: {
        id: post.author.id,
        name: post.author.username,
      },
      postHashtag: post.hashtags.map((tag) => ({
        id: tag.id,
        name: tag.name,
      })),
      mention: post.mention.map((m) => ({
        id: m.id,
        name: m.username,
      })),
      media: post.media.map((m) => ({
        id: m.id,
        url: m.url,
      })),
    }));
    return {
      data: transformedPosts,
      total,
      page,
      pageSize,
    };
  }
  async deletePost(id: string, user: UserDecorator) {
    const result = await this.postRepository.delete({
      id,
      author: { id: user.id },
    });
    if (result.affected === 0) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    return 'delete success';
  }
  async ensureAuthorExist(id: string) {
    const user = await this.userService.getOneByOptions({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async searchPosts(query: SearchPostsDto) {
    const { page, pageSize } = query;
    const queyBuilder = this.postRepository.createQueryBuilder('post');
    const conditions: Record<
      keyof Omit<SearchPostsDto, 'page' | 'pageSize'>,
      (value: string) => [string, ObjectLiteral]
    > = {
      author: (value: string) => ['post.author = :author', { author: value }],
      content: (value: string) => [
        'post.content LIKE :content',
        { content: `%${value}%` },
      ],
      postType: (value: postType) => [
        'post.postType = :postType',
        { postType: value },
      ],
    };
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && key in conditions) {
        const [condition, params] =
          conditions[key as keyof typeof conditions](value);
        queyBuilder.andWhere(condition, params);
      }
    });

    const totalCount = await queyBuilder.getCount();
    queyBuilder.skip((page - 1) * pageSize).take(pageSize);
    const posts = await queyBuilder.getMany();

    return {
      posts,
      totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  }
  private extractHashtags(content: string): string[] {
    return content.match(/#\w+/g)?.map((tag) => tag.slice(1)) || [];
  }

  private extractMentions(content: string): string[] {
    return content.match(/@\w+/g)?.map((mention) => mention.slice(1)) || [];
  }
}

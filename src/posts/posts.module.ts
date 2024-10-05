import { Module } from '@nestjs/common';
import { PostService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entity/post.entity';
import { HashtagModule } from 'src/hashtag/hashtag.module';
import { MediaModule } from 'src/media/media.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    HashtagModule,
    MediaModule,
    UserModule,
  ],
  providers: [PostService],
  controllers: [PostsController],
})
export class PostsModule {}

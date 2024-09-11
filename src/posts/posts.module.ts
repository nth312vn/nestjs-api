import { Module } from '@nestjs/common';
import { PostService } from './posts.service';
import { PostsController } from './posts.controller';

@Module({
  providers: [PostService],
  controllers: [PostsController],
})
export class PostsModule {}

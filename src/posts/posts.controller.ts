import { Body, Controller, Post } from '@nestjs/common';
import { CreatePostDto } from './dto/posts.dto';
import { PostService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostService) {}
  @Post('create')
  createPost(@Body() createPostDto: CreatePostDto) {
    console.log(createPostDto);
    return this.postService.createPost(createPostDto);
  }
}

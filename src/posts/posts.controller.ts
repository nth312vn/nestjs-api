import { Body, Controller, Post } from '@nestjs/common';
import { CreatePostDto } from './dto/posts.dto';

@Controller('posts')
export class PostsController {
  constructor() {}
  @Post('create')
  createPost(@Body() createPostDto: CreatePostDto) {
    console.log(createPostDto);
  }
}

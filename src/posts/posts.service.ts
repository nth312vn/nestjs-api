import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/posts.dto';

@Injectable()
export class PostService {
  constructor() {}
  createPost(createPostDto: CreatePostDto) {
    console.log(createPostDto);
  }
}

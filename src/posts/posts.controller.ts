import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto, PagingPostsDto, UpdatePostDto } from './dto/posts.dto';
import { PostService } from './posts.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { VerifyAccountGuard } from 'src/guard/verifyAccount.guard';
import { User } from 'src/decorator/user.decorator';
import { UserDecorator } from 'src/user/interface/user.interface';
@UseGuards(AuthGuard, VerifyAccountGuard)
@Controller('posts')
export class PostsController {
  constructor(private postService: PostService) {}
  @Post('create')
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }
  @Patch('update')
  updatePost(
    @Param() id: string,
    @Body() updatePostDto: UpdatePostDto,
    @User() user: UserDecorator,
  ) {
    return this.postService.updatePosts(updatePostDto, id, user);
  }
  @Get('detail/:id')
  getPostDetail(@Param() id: string) {
    return this.postService.getPostDetail(id);
  }
  @Get('list')
  getPostList(@User() user: UserDecorator, @Query() query: PagingPostsDto) {
    return this.postService.getListPostsByAuthorId(
      user,
      query.page,
      query.pageSize,
    );
  }
  @Delete('delete/:id')
  deletePost(@Param() id: string, @User() user: UserDecorator) {
    return this.postService.deletePost(id, user);
  }
}

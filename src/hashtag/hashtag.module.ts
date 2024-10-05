import { Module } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hashtag } from 'src/entity/hashtag.entity';
import { PostHashTagService } from './postHashTag.service';
import { PostHashtag } from 'src/entity/postHastag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hashtag, PostHashtag])],
  providers: [HashtagService, PostHashTagService],
  exports: [HashtagService, PostHashTagService],
})
export class HashtagModule {}

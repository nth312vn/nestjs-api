import { Module } from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hashtag } from 'src/entity/hashtag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hashtag])],
  providers: [HashtagService],
  exports: [HashtagService],
})
export class HashtagModule {}

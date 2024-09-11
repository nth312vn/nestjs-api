import { IsNotEmpty, MaxLength } from 'class-validator';
import { postType } from 'src/core/enum/postType';

export class CreatePostDto {
  @IsNotEmpty()
  type: postType;
  @IsNotEmpty()
  @MaxLength(500)
  content: string;
  hashtag?: string[];
  mention?: string[];
  meida?: string[];
}

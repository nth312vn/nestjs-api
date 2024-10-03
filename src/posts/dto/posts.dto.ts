import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { postType } from 'src/core/enum/postType';
import { MediaDto } from 'src/media/dto/media.dto';

export class CreatePostDto {
  @IsNotEmpty()
  @IsEnum(postType)
  type: postType;
  @IsNotEmpty()
  @IsString()
  content: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaDto)
  media?: MediaDto[];
}

import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
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
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaDto)
  media?: MediaDto[];
  @IsNotEmpty()
  @IsString()
  userId: string;
}
export class UpdatePostDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaDto)
  media?: MediaDto[];

  @IsOptional()
  @IsString()
  content?: string;
  @IsOptional()
  @IsEnum(postType)
  type?: postType;
}
export class PagingPostsDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsNotEmpty()
  @IsInt()
  @Max(100)
  @Min(1)
  pageSize: number = 10;
}

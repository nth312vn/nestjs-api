import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
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
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page: number = 1;

  @IsInt()
  @Type(() => Number)
  @Max(100)
  @Min(1)
  pageSize: number = 10;
}
export class SearchPostsDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  author: string;
  @IsOptional()
  @IsString()
  @MaxLength(100)
  content: string;
  @IsOptional()
  @IsEnum(postType)
  postType: postType;
}

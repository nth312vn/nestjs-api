import { IsEnum, IsNotEmpty, IsUrl } from 'class-validator';
import { mediaType } from 'src/core/enum/media';

export class MediaDto {
  @IsNotEmpty()
  @IsUrl()
  url: string;
  @IsNotEmpty()
  @IsEnum(mediaType)
  type: mediaType;
}

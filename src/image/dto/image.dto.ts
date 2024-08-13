import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';
export class BucketDto {
  @IsNotEmpty()
  bucketName: string;
}
export class GetSingleImageDto extends BucketDto {
  @IsNotEmpty()
  objectName: string;
}

export class GetMultipleImageQueryDto {
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(2)
  images: string[];
}

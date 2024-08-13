import { IsNotEmpty } from 'class-validator';

export class GetVideoDto {
  @IsNotEmpty()
  bucketName: string;
  @IsNotEmpty()
  objectName: string;
}

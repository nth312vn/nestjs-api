import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class GetFollowDto {
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
export class FollowDto {
  @IsNotEmpty()
  userId: string;
  @IsNotEmpty()
  followerId: string;
}

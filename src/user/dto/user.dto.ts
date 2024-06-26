import { IsEmail, IsInt, IsNotEmpty, MaxLength, Min } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @MaxLength(20)
  username: string;
  @IsNotEmpty()
  passwordHashed: string;
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  email: string;
  @IsNotEmpty()
  @MaxLength(50)
  firstName: string;
  @IsNotEmpty()
  @MaxLength(50)
  lastName: string;
  dateOfBirth?: string;
}
export class UpdateUserDto {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
}
export class GetFollowDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  pageSize: number;
}
export class AddFollowerDto {
  @IsNotEmpty()
  @IsInt()
  followerId: string;
}

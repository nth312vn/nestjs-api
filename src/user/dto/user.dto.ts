import {
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

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
  @MaxLength(50)
  @IsDateString()
  dateOfBirth?: Date;
}
export class UpdateUserDto {
  @IsOptional()
  @MaxLength(50)
  firstName: string;
  @IsOptional()
  @MaxLength(50)
  lastName?: string;
  @IsOptional()
  @MaxLength(50)
  @IsDateString()
  date_of_birth: Date;
}
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
export class AddFollowerDto {
  @IsNotEmpty()
  userId: string;
  @IsNotEmpty()
  followerId: string;
}

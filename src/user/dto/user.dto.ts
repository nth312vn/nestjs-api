import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
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

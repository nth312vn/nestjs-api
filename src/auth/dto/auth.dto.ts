import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @MaxLength(20)
  username: string;
  @IsNotEmpty()
  @MaxLength(20)
  password: string;
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
}
export class LoginDto {
  @IsNotEmpty()
  @MaxLength(20)
  userName: string;
  @IsNotEmpty()
  @MaxLength(20)
  password: string;
}
export class LogoutDto {
  @IsNotEmpty()
  refreshToken: string;
  @IsNotEmpty()
  @MaxLength(20)
  userName: string;
}

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
  username: string;
  @IsNotEmpty()
  @MaxLength(20)
  password: string;
}
export class LogoutDto {
  @IsNotEmpty()
  deviceId: string;
  @IsNotEmpty()
  userId: string;
}
export class ReAuthDto {
  @IsNotEmpty()
  refreshToken: string;
}
export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
export class ResetPasswordDto {
  @IsNotEmpty()
  token: string;
  @IsNotEmpty()
  newPassword: string;
}
export class ChangePasswordDto {
  @IsNotEmpty()
  oldPassword: string;
  @IsNotEmpty()
  newPassword: string;
}

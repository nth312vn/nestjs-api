import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, Matches, MaxLength } from 'class-validator';
import { trim } from 'lodash';

export class RegisterDto {
  @IsNotEmpty()
  @MaxLength(20)
  @Matches(/[a-zA-Z0-9_-]{2,20}/)
  @Transform(({ value }) => trim(value))
  username: string;
  @IsNotEmpty()
  @MaxLength(20)
  password: string;
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  @Transform(({ value }) => trim(value))
  email: string;
  @IsNotEmpty()
  @MaxLength(50)
  @Transform(({ value }) => trim(value))
  firstName: string;
  @IsNotEmpty()
  @MaxLength(50)
  @Transform(({ value }) => trim(value))
  lastName: string;
}
export class LoginDto {
  @IsNotEmpty()
  @MaxLength(20)
  @Matches(/[a-zA-Z0-9_-]{2,20}/)
  @Transform(({ value }) => trim(value))
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
  @Transform(({ value }) => trim(value))
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
  @Transform(({ value }) => trim(value))
  oldPassword: string;
  @IsNotEmpty()
  @Transform(({ value }) => trim(value))
  newPassword: string;
}
export class VerifyEmailDto {
  @IsNotEmpty()
  @Transform(({ value }) => trim(value))
  token: string;
}
export class AuthVerificationEmailDto {
  @IsNotEmpty()
  @Transform(({ value }) => trim(value))
  email: string;
}

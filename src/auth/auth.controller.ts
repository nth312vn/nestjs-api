import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { routeName } from 'src/core/config/routeName';
import {
  AuthVerificationEmailDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  LogoutDto,
  ReAuthDto,
  RegisterDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from './dto/auth.dto';
import { AuthService } from './auth.service';
import { successMessage } from 'src/core/message/successMessage';
import { Fingerprint, IFingerprint } from 'nestjs-fingerprint';
import { LoginMetaData } from './interface/auth.interface';
import { AuthGuard } from '../guard/auth.guard';
import { User } from 'src/decorator/user.decorator';
import { UserDecorator } from 'src/user/interface/user.interface';

@Controller(routeName.auth)
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post(routeName.register)
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    await this.authService.register(registerDto);
    return {
      message: successMessage.userHadBeenCreated,
    };
  }
  @Post(routeName.login)
  async login(
    @Body() loginDto: LoginDto,
    @Fingerprint() fp: IFingerprint,
    @Headers() headers: Headers,
  ) {
    const metaData: LoginMetaData = {
      id: fp.id,
      userAgent: headers['user-agent'],
      ipAddress: fp.ipAddress.value,
    };
    const { accessToken, refreshToken } = await this.authService.login(
      loginDto,
      metaData,
    );
    return {
      accessToken,
      refreshToken,
    };
  }
  @Post(routeName.logout)
  async logout(@Body() logoutDto: LogoutDto) {
    await this.authService.logout(logoutDto);
    return {
      message: successMessage.logoutSuccess,
    };
  }
  @Post(routeName.reAuth)
  async reAuth(@Body() reAuthDto: ReAuthDto) {
    const { accessToken, refreshToken } = await this.authService.reAuth(
      reAuthDto.refreshToken,
    );
    return {
      accessToken,
      refreshToken,
    };
  }
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    await this.authService.forgotPassword(email);
    return { message: 'Password reset link sent' };
  }
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
    return { message: 'Password has been reset successfully' };
  }
  @UseGuards(AuthGuard)
  @Post('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @User() user: UserDecorator,
  ) {
    await this.authService.changePassword(changePasswordDto, user);
  }
  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    await this.authService.verifyEmail(verifyEmailDto);
    return { message: 'Email has been verified' };
  }
  @Post('auth-verification-email')
  async authVerificationEmail(
    @Body() verifyEmailDto: AuthVerificationEmailDto,
  ) {
    await this.authService.authVerificationEmail(verifyEmailDto.email);
    return { message: 'Email has been verified' };
  }
}

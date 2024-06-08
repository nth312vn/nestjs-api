import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { routeName } from 'src/core/config/routeName';
import { LoginDto, LogoutDto, RegisterDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { successMessage } from 'src/core/message/successMessage';
import { Fingerprint, IFingerprint } from 'nestjs-fingerprint';
import { LoginMetaData } from './interface/auth.interface';

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
}

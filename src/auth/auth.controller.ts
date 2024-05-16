import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { routeName } from 'src/core/config/routeName';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { successMessage } from 'src/core/message/successMessage';

@Controller(routeName.auth)
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post(routeName.register)
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    try {
      await this.authService.register(registerDto);
      return {
        message: successMessage.userHadBeenCreated,
      };
    } catch (err) {
      throw err;
    }
  }
  @Post(routeName.login)
  async login(@Body() loginDto: LoginDto) {
    try {
      const { accessToken, refreshToken } =
        await this.authService.login(loginDto);
      return {
        accessToken,
        refreshToken,
      };
    } catch (err) {
      throw err;
    }
  }
}

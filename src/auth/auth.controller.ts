import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { routeName } from 'src/core/config/routeName';
import { RegisterDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { successMessage } from 'src/core/message/successMessage';

@Controller(routeName.auth)
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post(routeName.register)
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    try {
      await this.register(registerDto);
      return {
        message: successMessage.userHadBeenCreated,
      };
    } catch (err) {
      throw err;
    }
  }
}

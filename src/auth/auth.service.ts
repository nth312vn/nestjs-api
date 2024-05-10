import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/auth.dto';
import { exceptionMessage } from 'src/core/message/exceptionMessage';
import { UserService } from 'src/user/user.service';
import { PasswordService } from './password/password.servicce';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private passwordService: PasswordService,
  ) {}
  async register(registerDto: RegisterDto) {
    try {
      const { userName, password, email, firstName, lastName } = registerDto;
      const isExistUser = await this.userService.isExistUser(userName);
      if (isExistUser) {
        throw new ConflictException(exceptionMessage.userAlreadyExist);
      }
      const passwordHashed = await this.passwordService.hashPassword(password);
      await this.userService.createUser({
        userName,
        passwordHashed,
        email,
        firstName,
        lastName,
      });
    } catch (err) {
      throw err;
    }
  }
}

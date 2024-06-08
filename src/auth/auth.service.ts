import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { LoginDto, LogoutDto, RegisterDto } from './dto/auth.dto';
import { exceptionMessage } from 'src/core/message/exceptionMessage';
import { UserService } from 'src/user/user.service';
import { PasswordService } from './password/password.service';
import { TokenService } from './token/token.service';
import { LoginMetaData } from './interface/auth.interface';
import { DeviceSessionService } from './deviceSession/deviceSession.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private passwordService: PasswordService,
    private deviceSessionService: DeviceSessionService,
    private tokenService: TokenService,
  ) {}
  private logger = new Logger(AuthService.name);
  async register(registerDto: RegisterDto) {
    const { username, password, email, firstName, lastName } = registerDto;
    const isExistUser = await this.userService.getUserInfo(username);
    if (isExistUser) {
      throw new ConflictException(exceptionMessage.userAlreadyExist);
    }

    const passwordHashed = await this.passwordService.hashPassword(password);
    await this.userService.createUser({
      username,
      passwordHashed,
      email,
      firstName,
      lastName,
    });
    this.logger.log(`User registered: ${username}`);
  }
  async login(loginDto: LoginDto, metaData: LoginMetaData) {
    const user = await this.userService.getUserInfo(loginDto.username);
    if (!user) {
      throw new NotFoundException(exceptionMessage.userIsNotFound);
    }
    const isMatchPassword = await this.passwordService.isMatchPassword(
      loginDto.password,
      user.passwordHashed,
    );
    if (!isMatchPassword) {
      throw new BadRequestException(exceptionMessage.invalidPassword);
    }
    const { id, email, username } = user;
    const session = await this.deviceSessionService.getSessionInfo(metaData.id);
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken({ id, username, email }),
      this.tokenService.generateRefreshToken({ id, username }),
    ]);
    if (!session) {
      await this.deviceSessionService.saveDeviceSession(metaData, user);
    }
    this.logger.log(`User logged in: ${username}`);
    return {
      accessToken,
      refreshToken,
    };
  }
  async logout(logoutDto: LogoutDto) {
    await this.deviceSessionService.deleteDeviceSession(logoutDto);
    this.logger.log(
      `User logged out: ${logoutDto.userId} ${logoutDto.deviceId}`,
    );
  }
}

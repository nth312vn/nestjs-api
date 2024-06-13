import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  LoginDto,
  LogoutDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { exceptionMessage } from 'src/core/message/exceptionMessage';
import { UserService } from 'src/user/user.service';
import { PasswordService } from './password/password.service';
import { TokenService } from '../token/token.service';
import { LoginMetaData } from './interface/auth.interface';
import { DeviceSessionService } from './deviceSession/deviceSession.service';
import { compareTimeStampLater } from 'src/utils/dateTime';
import { ConfigService } from '@nestjs/config';
import { envKey } from 'src/core/config/envKey';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private passwordService: PasswordService,
    private deviceSessionService: DeviceSessionService,
    private tokenService: TokenService,
    private configService: ConfigService,
    private mailerService: MailerService,
  ) {}
  private logger = new Logger(AuthService.name);
  async register(registerDto: RegisterDto) {
    const { username, password, email, firstName, lastName } = registerDto;
    const isExistUser = await this.userService.getUserInfo({ username });
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
    const user = await this.userService.getUserInfo({
      username: loginDto.username,
    });
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

    if (!session) {
      await this.deviceSessionService.saveDeviceSession(metaData, user);
    }
    const [accessToken, refreshToken] = await this.tokenService.generate({
      id,
      username,
      email,
      deviceId: metaData.id,
    });
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
  async reAuth(refreshToken: string) {
    try {
      const payload = await this.tokenService.verifyRefreshToken(refreshToken);
      const session =
        await this.deviceSessionService.getDeviceSessionWithUserInfo(
          payload.deviceId,
        );
      if (!session || session.user.id !== payload.id) {
        throw new Error();
      }
      const tokenPayload = {
        id: payload.id,
        username: payload.username,
        email: payload.email,
        deviceId: payload.deviceId,
      };
      if (compareTimeStampLater(payload.exp, new Date().getTime())) {
        const [accessToken, newRefreshToken] =
          await this.tokenService.generate(tokenPayload);
        return {
          accessToken,
          refreshToken: newRefreshToken,
        };
      } else {
        const accessToken =
          await this.tokenService.generateAccessToken(tokenPayload);
        return {
          accessToken,
          refreshToken,
        };
      }
    } catch {
      throw new UnauthorizedException('Refresh token invalid');
    }
  }
  async forgotPassword(email: string) {
    const user = await this.userService.getUserInfo({ email });
    if (!user) {
      throw new NotFoundException('email is invalid');
    }
    const token = this.tokenService.generateForgotPasswordToken({
      email,
    });
    const url = `${this.configService.get<string>(envKey.FRONTEND_URL)}/reset-password?token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset',
      template: './reset-password',
      context: {
        url,
      },
    });
  }
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;
    const payload = await this.tokenService.verifyForgotPasswordToken(token);
    const user = await this.userService.getUserInfo({ email: payload.email });
    if (!user) {
      throw new NotFoundException(
        'email resetPasswordDto:ResetPasswordDtois invalid',
      );
    }
    const passwordHashed = await this.passwordService.hashPassword(newPassword);
    await this.userService.updatePassword(user.id, passwordHashed);
    return { message: 'Password has been reset' };
  }
}

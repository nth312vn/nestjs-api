import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ChangePasswordDto,
  LoginDto,
  LogoutDto,
  RegisterDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from './dto/auth.dto';
import { exceptionMessage } from 'src/core/message/exceptionMessage';
import { UserService } from 'src/user/user.service';
import { PasswordService } from './password/password.service';
import { TokenService } from '../token/token.service';
import { LoginMetaData } from './interface/auth.interface';
import { DeviceSessionService } from './deviceSession/deviceSession.service';
import { ConfigService } from '@nestjs/config';
import { envKey } from 'src/core/config/envKey';
import { DataSource } from 'typeorm';
import { UserDecorator } from 'src/user/interface/user.interface';
import { SendMailService } from 'src/mail/mail.service';
import { verifyEmailStatus } from 'src/core/enum/verifyEmailStatus';
import { CaptchaService } from 'src/captcha/captcha.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private passwordService: PasswordService,
    private deviceSessionService: DeviceSessionService,
    private tokenService: TokenService,
    private configService: ConfigService,
    private sendMailService: SendMailService,
    private dataSource: DataSource,
    private captchaService: CaptchaService,
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
    if (
      !this.captchaService.validateCaptcha(
        loginDto.captchaId,
        loginDto.captchaValue,
      )
    ) {
      throw new BadRequestException('Invalid captcha');
    }
    const [accessToken, refreshToken] = await this.tokenService.generate({
      id,
      username,
      email,
      deviceId: metaData.id,
      verifyStatus: user.verify_email_status,
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
      const { id, username, email, deviceId, verifyStatus } = payload;
      const [accessToken, newRefreshToken] = await this.tokenService.generate({
        id,
        username,
        email,
        deviceId,
        verifyStatus,
      });
      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new UnauthorizedException('Refresh token invalid');
    }
  }
  async forgotPassword(email: string) {
    const user = await this.userService.ensureEmailIsCorrect(email);
    const token = await this.tokenService.generateForgotPasswordToken({
      email,
    });
    await this.userService.updateUser({
      id: user.id,
      forgot_password_token: token,
    });
    const url = `${this.configService.get<string>(envKey.FRONTEND_URL)}/reset-password?token=${token}`;
    await this.sendMailService.sendPasswordReset(email, url);
  }
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();
    try {
      const { token, newPassword } = resetPasswordDto;
      const payload = await this.tokenService.verifyForgotPasswordToken(token);
      const user = await this.userService.getUserInfo({ email: payload.email });
      if (!user) {
        throw new NotFoundException('email is invalid');
      }
      if (!user.forgot_password_token || user.forgot_password_token !== token) {
        throw new NotFoundException('token is invalid');
      }
      const passwordHashed =
        await this.passwordService.hashPassword(newPassword);
      await queryRunner.manager.save({
        ...user,
        passwordHashed,
        forgot_password_token: null,
      });
      await this.deviceSessionService.deleteAllDeviceSessionWithManager(
        queryRunner.manager,
        user.id,
      );
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
  async changePassword(
    changePasswordDto: ChangePasswordDto,
    userDecorator: UserDecorator,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();
    try {
      const user = await this.userService.getUserInfo({ id: userDecorator.id });
      const isMatchPassword = await this.passwordService.isMatchPassword(
        changePasswordDto.oldPassword,
        user.passwordHashed,
      );
      if (!isMatchPassword) {
        throw new UnauthorizedException('Password is invalid');
      }
      const passwordHashed = await this.passwordService.hashPassword(
        changePasswordDto.newPassword,
      );
      const result = await this.userService.updateUser({
        id: user.id,
        passwordHashed,
      });
      await queryRunner.manager.save(result);
      await this.deviceSessionService.deleteAllDeviceSessionWithManager(
        queryRunner.manager,
        user.id,
      );
      await queryRunner.commitTransaction();
      return { message: 'Password has been update successfully' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const payload = await this.tokenService.verifyEmailVerificationToken(
      verifyEmailDto.token,
    );
    const user = await this.userService.getUserInfo({
      email: payload.email,
    });
    if (!user) {
      throw new NotFoundException('email is invalid');
    }
    if (user.verify_email_status === verifyEmailStatus.VERIFIED) {
      throw new BadRequestException('email has been verified');
    }
    if (user.verify_email_status === verifyEmailStatus.BANNED) {
      throw new BadRequestException('email has been banned');
    }
    await this.userService.updateUser({
      id: user.id,
      verify_email_status: verifyEmailStatus.VERIFIED,
      verify_email_token: null,
    });
  }
  async authVerificationEmail(email: string) {
    const user = await this.userService.ensureEmailIsCorrect(email);
    if (user.verify_email_status === verifyEmailStatus.VERIFIED) {
      throw new BadRequestException('email has been verified');
    }
    const token = await this.tokenService.generateEmailVerificationToken({
      email,
    });
    await this.userService.updateUser({
      id: user.id,
      verify_email_token: token,
    });
    const url = `${this.configService.get<string>(envKey.FRONTEND_URL)}/verify-email?token=${token}`;
    await this.sendMailService.sendVerificationEmail(email, url);
  }
}

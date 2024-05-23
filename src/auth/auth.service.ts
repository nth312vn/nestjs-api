import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoginDto, LogoutDto, RegisterDto } from './dto/auth.dto';
import { exceptionMessage } from 'src/core/message/exceptionMessage';
import { UserService } from 'src/user/user.service';
import { PasswordService } from './password/password.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRoles } from 'src/entity/userRole.entity';
import { RoleService } from 'src/role/role.service';
import { TokenService } from './token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private passwordService: PasswordService,
    @InjectRepository(UserRoles)
    private userRoleRepository: Repository<UserRoles>,
    private roleService: RoleService,
    private tokenService: TokenService,
  ) {}
  async register(registerDto: RegisterDto) {
    try {
      const { userName, password, email, firstName, lastName, role } =
        registerDto;
      const isExistUser = await this.userService.isExistUser(userName);
      if (isExistUser) {
        throw new ConflictException(exceptionMessage.userAlreadyExist);
      }
      const roleData = await this.roleService.findRole(role);
      if (!roleData) {
        throw new ConflictException(exceptionMessage.roleIsNotValid);
      }
      const passwordHashed = await this.passwordService.hashPassword(password);
      const userSaved = await this.userService.createUser({
        userName,
        passwordHashed,
        email,
        firstName,
        lastName,
      });
      const userRole = this.userRoleRepository.create({
        user: userSaved,
        role: roleData,
      });
      await this.userRoleRepository.save(userRole);
    } catch (err) {
      throw err;
    }
  }
  async login(loginDto: LoginDto) {
    try {
      const user = await this.userService.isExistUser(loginDto.userName);
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
      const { id, email, userName } = user;
      const [accessToken, refreshToken] = await Promise.all([
        this.tokenService.generateAccessToken({ id, userName, email }),
        this.tokenService.generateRefreshToken({ id, userName }),
      ]);
      await this.tokenService.saveRefreshToken(user, refreshToken);
      return {
        accessToken,
        refreshToken,
      };
    } catch (err) {
      throw err;
    }
  }
  async logout(logoutDto: LogoutDto) {
    try {
      const { userName, refreshToken } = logoutDto;
      const user = await this.userService.isExistUser(userName);
      if (!user) {
        throw new NotFoundException(exceptionMessage.userIsNotFound);
      }
      const tokenInfo = await this.tokenService.getRefreshTokenInfo(
        user.id,
        refreshToken,
      );
      if (!tokenInfo) {
        throw new NotFoundException(exceptionMessage.refreshTokenIsNotFound);
      }
      await this.tokenService.deleteRefreshToken(tokenInfo.id);
    } catch (err) {
      throw err;
    }
  }
}

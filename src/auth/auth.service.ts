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
import { LoginMetaData } from './interface/auth.interface';
import { DeviceSessionService } from './deviceSession/deviceSession.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private passwordService: PasswordService,
    @InjectRepository(UserRoles)
    private userRoleRepository: Repository<UserRoles>,
    private roleService: RoleService,
    private tokenService: TokenService,
    private deviceSessionService: DeviceSessionService,
  ) {}
  async register(registerDto: RegisterDto) {
    try {
      const { userName, password, email, firstName, lastName, role } =
        registerDto;
      const isExistUser = await this.userService.getUserInfo(userName);
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
  async login(loginDto: LoginDto, metaData: LoginMetaData) {
    try {
      const user = await this.userService.getUserInfo(loginDto.userName);
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
      const session = await this.deviceSessionService.getSessionInfo(
        metaData.id,
      );
      const [accessToken, refreshToken] = await Promise.all([
        this.tokenService.generateAccessToken({ id, userName, email }),
        this.tokenService.generateRefreshToken({ id, userName }),
      ]);
      if (!session) {
        await this.deviceSessionService.saveDeviceSession(metaData, user);
      }
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
      console.log(logoutDto);
    } catch (err) {
      throw err;
    }
  }
}

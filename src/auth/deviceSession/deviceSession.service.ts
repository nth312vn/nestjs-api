import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core/base/baseService';
import { DeviceSession } from 'src/entity/deviceSession.entity';
import { EntityManager, Repository } from 'typeorm';
import { LoginMetaData } from '../interface/auth.interface';
import { Users } from 'src/entity/user.entity';
import { LogoutDto } from '../dto/auth.dto';

@Injectable()
export class DeviceSessionService extends BaseService<DeviceSession> {
  constructor(
    @InjectRepository(DeviceSession)
    private deviceSessionRepository: Repository<DeviceSession>,
  ) {
    super(deviceSessionRepository);
  }
  getSessionInfo(deviceId: string) {
    return this.getOneByOptions({
      where: {
        device_id: deviceId,
      },
    });
  }
  saveDeviceSession(metaData: LoginMetaData, user: Users) {
    const { id, ipAddress, userAgent } = metaData;
    const deviceInfo = new DeviceSession();
    deviceInfo.device_id = id;
    deviceInfo.ip_address = ipAddress;
    deviceInfo.user_agent = userAgent;
    deviceInfo.user = user;
    return this.create(deviceInfo);
  }
  async getDeviceSessionWithUserInfo(deviceId: string) {
    return await this.deviceSessionRepository
      .createQueryBuilder('device_session')
      .leftJoinAndSelect('device_session.user', 'users')
      .where('device_session.device_id = :deviceId', { deviceId })
      .getOne();
  }
  async deleteDeviceSession(logoutDto: LogoutDto) {
    const { userId, deviceId } = logoutDto;
    const session = await this.getDeviceSessionWithUserInfo(deviceId);
    if (!session || session.user.id !== userId) {
      throw new ForbiddenException();
    }
    return this.deleteById(session.id);
  }
  deleteAllDeviceSessionWithManager(manager: EntityManager, userId: string) {
    return manager
      .createQueryBuilder()
      .delete()
      .from(DeviceSession)
      .where('userId = :userId', { userId })
      .execute();
  }
}

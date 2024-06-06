import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core/base/baseService';
import { DeviceSession } from 'src/entity/deviceSession.entity';
import { Repository } from 'typeorm';
import { LoginMetaData } from '../interface/auth.interface';
import { Users } from 'src/entity/user.entity';

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
  deleteDeviceSession(deviceId: string) {
    return this.deleteById(deviceId);
  }
}

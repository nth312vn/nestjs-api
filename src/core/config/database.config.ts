import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DeviceSession } from 'src/entity/deviceSession.entity';
import { Follow } from 'src/entity/follow.entity';
import { Roles } from 'src/entity/role.entity';
import { Users } from 'src/entity/user.entity';
import { UserRoles } from 'src/entity/userRole.entity';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: process.env.DATABASE_TYPE as 'mysql',
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [Users, Roles, UserRoles, DeviceSession, Follow],
    synchronize: true,
    extra: {
      min: 2,
      max: 10,
    },
  }),
);

import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DeviceSession } from 'src/entity/deviceSession.entity';
import { Follow } from 'src/entity/follow.entity';
import { Hashtag } from 'src/entity/hashtag.entity';
import { Media } from 'src/entity/media';
import { Mention } from 'src/entity/mention';
import { Post } from 'src/entity/post.entity';
import { PostHashtag } from 'src/entity/postHastag.entity';
import { Roles } from 'src/entity/role.entity';
import { Users } from 'src/entity/user.entity';
import { UserRoles } from 'src/entity/userRole.entity';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: (process.env.DATABASE_TYPE as 'mysql') || 'mysql',
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [
      Users,
      Roles,
      UserRoles,
      DeviceSession,
      Follow,
      Post,
      Mention,
      Media,
      Hashtag,
      PostHashtag,
    ],
    synchronize: true,
    extra: {
      max: 10,
    },
  }),
);

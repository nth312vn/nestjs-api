import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './core/config/database.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { TokenModule } from './token/token.module';
import { FingerPrintModule } from './fingerPrint/fingerPrint.module';
import { MailModule } from './mail/mail.module';
import { FollowModule } from './follow/follow.module';
import { UploadModule } from './upload/upload.module';
import { MinioClientModule } from './minio/minioClient.module';
import { ImageModule } from './image/image.module';
import { RedisConfigModule } from './redisConfig/redisConfig.module';
import { CaptchaModule } from './captcha/captcha.module';
import { QueueModule } from './queue/queue.module';
import { VideoModule } from './video/video.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisConfigModule,
    TypeOrmModule.forRoot(databaseConfig()),
    UserModule,
    AuthModule,
    RoleModule,
    TokenModule,
    FingerPrintModule,
    MailModule,
    FollowModule,
    MinioClientModule,
    UploadModule,
    ImageModule,
    CaptchaModule,
    QueueModule,
    VideoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

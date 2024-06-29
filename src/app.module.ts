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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig()),
    UserModule,
    AuthModule,
    RoleModule,
    TokenModule,
    FingerPrintModule,
    MailModule,
    FollowModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

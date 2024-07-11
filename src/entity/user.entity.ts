import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoles } from './userRole.entity';
import { DeviceSession } from './deviceSession.entity';
import { verifyEmailStatus } from 'src/core/enum/verifyEmailStatus';
import { Follow } from './follow.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ length: 20, unique: true })
  username: string;
  @Column()
  passwordHashed: string;
  @Column({ length: 50, unique: true })
  email: string;
  @Column({ length: 50 })
  firstName: string;
  @Column({ length: 50 })
  lastName: string;
  @Column({ nullable: true })
  avatar: string;
  @Column({ type: 'date', nullable: true })
  date_of_birth: Date;
  @Column({ nullable: true })
  forgot_password_token: string;
  @Column({
    type: 'enum',
    enum: [
      verifyEmailStatus.NOT_VERIFIED,
      verifyEmailStatus.VERIFIED,
      verifyEmailStatus.BANNED,
    ],
    default: verifyEmailStatus.NOT_VERIFIED,
  })
  verify_email_status: verifyEmailStatus;
  @Column({ nullable: true })
  verify_email_token: string;
  @OneToMany(() => UserRoles, (UserRoles) => UserRoles.user)
  userRoles: UserRoles[];
  @OneToMany(() => DeviceSession, (deviceSession) => deviceSession.id)
  deviceSession: DeviceSession[];
  @OneToMany(() => Follow, (follows) => follows.user)
  followers: Follow[];

  @OneToMany(() => Follow, (follows) => follows.follower)
  followings: Follow[];
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}

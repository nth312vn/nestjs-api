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

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ length: 20, unique: true })
  userName: string;
  @Column()
  passwordHashed: string;
  @Column({ length: 50, unique: true })
  email: string;
  @Column({ length: 50 })
  firstName: string;
  @Column({ length: 50 })
  lastName: string;

  @OneToMany(() => UserRoles, (UserRoles) => UserRoles.user)
  userRoles: UserRoles[];
  @OneToMany(() => DeviceSession, (deviceSession) => deviceSession.id)
  tokens: DeviceSession[];
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}

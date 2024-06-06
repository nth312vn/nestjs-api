import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './user.entity';

@Entity('device_session')
export class DeviceSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: Users;
  @Column()
  device_id: string;
  @Column()
  user_agent: string;
  @Column()
  ip_address: string;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}

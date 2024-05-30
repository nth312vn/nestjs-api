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

@Entity()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => Users, (user) => user.tokens)
  @JoinColumn({ name: 'userId' })
  user: Users;
  @Column()
  device_id: string;
  @Column()
  user_agent: string;
  @Column()
  refresh_token: string;
  @Column()
  ip_address: string;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}

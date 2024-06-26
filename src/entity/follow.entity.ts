import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './user.entity';

@Entity()
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Users, (user) => user.followers)
  user: Users;

  @ManyToOne(() => Users, (user) => user.followings)
  follower: Users;
  @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  followed_at: Date;

  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}

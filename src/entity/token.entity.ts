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
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Users, (user) => user.tokens)
  @JoinColumn({ name: 'userId' })
  user: Users;
  @Column()
  token: string;
  @Column()
  date: Date;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}

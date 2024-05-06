import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './user.entity';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Users)
  user: Users;
  @Column()
  token: string;
  @Column({ type: 'timestamp' })
  date: Date;
}

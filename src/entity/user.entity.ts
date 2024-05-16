import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoles } from './userRole.entity';
import { Token } from './token.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;
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
  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}

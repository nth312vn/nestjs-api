import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRoles } from './userRole.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 20, unique: true })
  userName: string;
  @Column({ length: 100 })
  passwordHashed: string;
  @Column({ length: 50, unique: true })
  email: string;
  @Column({ length: 50 })
  firstName: string;
  @Column({ length: 50 })
  lastName: string;
  @OneToMany(() => UserRoles, (UserRoles) => UserRoles.user)
  @JoinTable()
  role: UserRoles[];
}

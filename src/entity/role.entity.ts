import {
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRoles } from './userRole.entity';

@Entity()
export class Roles {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 50 })
  name: string;
  @OneToMany(() => UserRoles, (UserRoles) => UserRoles.role)
  @JoinTable()
  users: UserRoles[];
}

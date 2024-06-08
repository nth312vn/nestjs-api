import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './user.entity';
import { Roles } from './role.entity';

@Entity()
export class UserRoles {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => Users, (user) => user.userRoles)
  @JoinColumn({ name: 'userId' })
  user: Users;
  @ManyToOne(() => Roles, (role) => role.userRoles)
  @JoinColumn({ name: 'roleId' })
  role: Roles;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}

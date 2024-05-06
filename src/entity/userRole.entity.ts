import { Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './user.entity';
import { Roles } from './role.entity';

@Entity()
export class UserRoles {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Users, (user) => user.role)
  @JoinTable()
  user: Users;
  @ManyToOne(() => Roles, (role) => role.users)
  @JoinTable()
  role: Roles;
}

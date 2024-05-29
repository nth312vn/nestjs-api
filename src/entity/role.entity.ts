import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoles } from './userRole.entity';

@Entity()
export class Roles {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ length: 50 })
  name: string;
  @Column({ type: 'text', nullable: true })
  description: string;
  @OneToMany(() => UserRoles, (UserRoles) => UserRoles.role)
  userRoles: UserRoles[];
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}

import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { Users } from './user.entity';
@Entity()
export class Mention {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => Post, (post) => post.mention)
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: Post;
  @ManyToOne(() => Users, (user) => user.mentions)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: Users;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}

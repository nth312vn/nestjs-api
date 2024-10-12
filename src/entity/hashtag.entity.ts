import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity({
  name: 'hashtag',
})
export class Hashtag {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ length: 100 })
  name: string;
  @ManyToMany(() => Post, (post) => post.hashtags, {
    cascade: true,
  })
  @JoinTable({
    name: 'post_hashtag',
    joinColumn: {
      name: 'postId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'hashtagId',
      referencedColumnName: 'id',
    },
  })
  posts: Post[];

  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}

import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Hashtag } from './hashtag.entity';
import { Post } from './post.entity';
@Entity({ name: 'post_hashtag' })
export class PostHashtag {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => Hashtag, (hashtag) => hashtag.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hashtag_id', referencedColumnName: 'id' })
  hashtag: Hashtag;
  @ManyToOne(() => Post, (post) => post.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: Post;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}

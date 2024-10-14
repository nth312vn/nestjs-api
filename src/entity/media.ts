import { mediaType } from 'src/core/enum/media';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ length: 100 })
  url: string;
  @Column({
    type: 'enum',
    enum: [mediaType.IMAGE, mediaType.VIDEO, mediaType.AUDIO],
  })
  type: mediaType;
  @ManyToOne(() => Post, (post) => post.media, { cascade: true })
  @JoinColumn({ name: 'post_id', referencedColumnName: 'id' })
  post: Post;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}

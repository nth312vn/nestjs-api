import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostHashtag } from './postHastag.entity';
import { Users } from './user.entity';
import { postType } from 'src/core/enum/postType';
import { Media } from './media';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'mediumtext' })
  content: string;
  @Column({
    type: 'enum',
    enum: [
      postType.POST,
      postType.RE_POST,
      postType.COMMENT,
      postType.QUOTE_POST,
    ],
    default: postType.POST,
  })
  postType: postType;
  @Column({ default: 0 })
  guest_view: number;
  @Column({ default: 0 })
  user_view: number;
  @OneToMany(() => PostHashtag, (postHashtag) => postHashtag.post)
  postHashtag: PostHashtag[];
  @ManyToOne(() => Users, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author', referencedColumnName: 'id' })
  author: Users;
  @OneToMany(() => Media, (media) => media.post, { cascade: true })
  media: Media[];
  @ManyToMany(() => Users, (users) => users.postsMention, { cascade: true })
  mention: Users[];
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './user.entity';
import { postType } from 'src/core/enum/postType';
import { Media } from './media';
import { Hashtag } from './hashtag.entity';

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
  @ManyToMany(() => Hashtag, (hashtag) => hashtag.posts, {
    onDelete: 'CASCADE',
  })
  hashtags: Hashtag[];
  @ManyToOne(() => Users, (user) => user.id, { cascade: true })
  @JoinColumn({ name: 'author', referencedColumnName: 'id' })
  author: Users;
  @OneToMany(() => Media, (media) => media.post, { onDelete: 'CASCADE' })
  media: Media[];
  @ManyToMany(() => Users, (users) => users.postsMention, { cascade: true })
  @JoinTable({
    name: 'mention',
    joinColumn: {
      name: 'postId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  mention: Users[];
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}

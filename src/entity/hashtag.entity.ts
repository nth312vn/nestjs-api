import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostHashtag } from './postHastag.entity';

@Entity({
  name: 'hashtag',
})
export class Hashtag {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ length: 100 })
  name: string;
  @OneToMany(() => PostHashtag, (postHashtag) => postHashtag.hashtag, {
    cascade: true,
  })
  postHashtag: PostHashtag[];
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}

import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BASE } from '../../common/entities/base.entity';
import { POSTS } from './post.entity';

@Entity('HASHTAGS')
export class HASHTAGS extends BASE {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => POSTS, (post) => post.hashtags)
  @JoinTable()
  posts: POSTS[];
}

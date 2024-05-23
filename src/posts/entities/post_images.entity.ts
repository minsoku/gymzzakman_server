import { Column, Entity, ManyToOne } from 'typeorm';
import { POSTS } from './post.entity';
import { BASE } from '../../common/entities/base.entity';

@Entity('POST_IMAGES')
export class POSTS_IMAGES extends BASE {
  @Column()
  url: string;

  @Column()
  order: number;

  @ManyToOne(() => POSTS, (post) => post.images)
  post: POSTS;
}

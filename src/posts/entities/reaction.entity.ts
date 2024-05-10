import { Column, Entity, ManyToOne } from 'typeorm';
import { BASE } from '../../common/entities/base.entity';
import { POSTS } from './post.entity';
import { USERS } from '../../users/entities/user.entity';

@Entity('REACTIONS')
export class REACTIONS extends BASE {
  @ManyToOne(() => USERS, (user) => user.reactions, {
    nullable: false,
  })
  user: USERS;

  @ManyToOne(() => POSTS, (post) => post.reactions, {
    nullable: false,
  })
  post: POSTS;

  @Column({ default: false })
  isLiked: boolean;

  @Column({ default: false })
  isDisLiked: boolean;
}

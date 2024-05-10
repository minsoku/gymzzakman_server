import { Column, Entity, ManyToOne } from 'typeorm';
import { USERS } from '../../users/entities/user.entity';
import { POSTS } from '../../posts/entities/post.entity';
import { BASE } from '../../common/entities/base.entity';

@Entity('COMMENTS')
export class COMMENTS extends BASE {
  @ManyToOne(() => USERS, (user) => user.comments, {
    nullable: false,
  })
  author: USERS;

  @ManyToOne(() => POSTS, (post) => post.comments, {
    nullable: false,
  })
  post: POSTS;

  @Column({
    nullable: false,
  })
  content: string;
}

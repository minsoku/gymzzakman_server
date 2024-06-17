import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { IsString } from 'class-validator';
import { stringValidationMessage } from '../../common/validation-message/string-validation.message';
import { USERS } from '../../users/entities/user.entity';
import { BASE } from '../../common/entities/base.entity';
import { REACTIONS } from './reaction.entity';
import { COMMENTS } from '../../comments/entites/comment.entity';
import { POSTS_IMAGES } from './post_images.entity';
import { HASHTAGS } from './hashtags.entity';

@Entity('POSTS')
export class POSTS extends BASE {
  @ManyToOne(() => USERS, (user) => user.posts, {
    nullable: false,
  })
  author: USERS;

  @OneToMany(() => REACTIONS, (reaction) => reaction.post, {
    cascade: true,
  })
  reactions: REACTIONS[];

  @OneToMany(() => COMMENTS, (comment) => comment.post, {
    cascade: true,
  })
  comments: COMMENTS[];

  @ManyToMany(() => HASHTAGS, (hashtag) => hashtag.posts)
  @JoinTable()
  hashtags: HASHTAGS[];

  @OneToMany('POSTS_IMAGES', 'posts')
  images: POSTS_IMAGES[];

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  title: string;

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  content: string;

  @Column({
    nullable: true,
    default: 0,
  })
  likeCount: number;

  @Column({
    nullable: true,
    default: 0,
  })
  dislikeCount: number;

  @Column({
    default: 0,
  })
  viewCount: number;

  @Column({
    type: 'enum',
    nullable: false,
    enum: [
      'INFORMATION', // 정보공유
      'AMITY', // 우리동네
      'CERTIFICATIONS', // 운동인증
      'FAQ', // 질문
    ],
    default: 'INFORMATION',
  })
  category: string;

  // 위도
  @Column()
  lat: string;
  // 경도
  @Column()
  lng: string;

  isLiked: boolean;
  isDisLiked: boolean;
}

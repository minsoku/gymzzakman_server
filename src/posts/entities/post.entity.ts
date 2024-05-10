import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { IsString } from 'class-validator';
import { stringValidationMessage } from '../../common/validation-message/string-validation.message';
import { USERS } from '../../users/entities/user.entity';
import { BASE } from '../../common/entities/base.entity';
import { REACTIONS } from './reaction.entity';
import { COMMENTS } from '../../comments/entites/comment.entity';

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
      'INFORMATION', // 정보
      'AMITY', // 친목
      'CERTIFICATIONS', // 인증
      'FAQ', // 질문
    ],
    default: 'INFORMATION',
  })
  type: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  images: string;

  isLiked: boolean;
  isDisLiked: boolean;
}

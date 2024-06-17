import { Column, Entity, OneToMany } from 'typeorm';
import { IsEmail, IsString, Length } from 'class-validator';
import { Exclude } from 'class-transformer';
import { stringValidationMessage } from '../../common/validation-message/string-validation.message';
import { lengthValidationMessage } from '../../common/validation-message/length-validation.message';
import { emailValidationMessage } from '../../common/validation-message/email-validation.message';
import { BASE } from '../../common/entities/base.entity';
import { POSTS } from '../../posts/entities/post.entity';
import { REACTIONS } from '../../posts/entities/reaction.entity';
import { COMMENTS } from '../../comments/entites/comment.entity';

@Entity('USERS')
export class USERS extends BASE {
  @Column({
    length: 20,
    unique: true,
  })
  @IsString({
    message: stringValidationMessage,
  })
  @Length(1, 20, {
    message: lengthValidationMessage,
  })
  nickname: string;

  @Column({
    unique: true,
  })
  @IsString({
    message: stringValidationMessage,
  })
  @IsEmail({}, { message: emailValidationMessage })
  email: string;

  @Column()
  @IsString({ message: stringValidationMessage })
  @Length(4, 16, { message: lengthValidationMessage })
  @Exclude({
    toPlainOnly: true,
  })
  password: string;

  @Column({ length: 20, unique: true })
  @IsString({
    message: stringValidationMessage,
  })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: ['USER', 'ADMIN'],
    default: 'USER',
  })
  role: string;

  @Column({
    type: 'enum',
    enum: ['EMAIL', 'KAKAOTALK', 'GOOGLE', 'FACEBOOK'],
    default: 'EMAIL',
  })
  provider: string;

  @Column({ default: null, nullable: true })
  profileImage: string;

  @OneToMany(() => POSTS, (post) => post.author)
  posts: POSTS[];

  @OneToMany(() => REACTIONS, (reaction) => reaction.user)
  reactions: REACTIONS[];

  @OneToMany(() => COMMENTS, (comment) => comment.author)
  comments: COMMENTS[];
}

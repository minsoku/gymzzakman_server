import { Module } from '@nestjs/common';
import { PostsCommentService } from './comments.service';
import { PostsCommentController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { COMMENTS } from './entites/comment.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [AuthModule, UsersModule, TypeOrmModule.forFeature([COMMENTS])],
  controllers: [PostsCommentController],
  providers: [PostsCommentService],
  exports: [PostsCommentService],
})
export class CommentsModule {}

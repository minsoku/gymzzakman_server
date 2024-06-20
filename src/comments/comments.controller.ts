import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guard/access-token.guard';
import { TransactionInterceptor } from '../common/interceptor/transaction.interceptor';
import { User } from '../users/decorator/user.decorator';
import { PostsCommentService } from './comments.service';

@Controller('posts-comment')
export class PostsCommentController {
  constructor(private readonly postsCommentService: PostsCommentService) {}

  @Get(':id')
  getAllCommentsById(@Param('id') id: number) {
    return this.postsCommentService.getCommentsByPostId(id);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async postComment(
    @User('id') userId: number,
    @Body() body: { content: string; postId: number },
  ) {
    try {
      const post = await this.postsCommentService.createComment(userId, body);
      const comment = await this.postsCommentService.getCommentsByPostId(
        body.postId,
      );

      return {
        post,
        success: true,
        message: '댓글이 성공적으로 작성되었습니다.',
        data: comment,
      };
    } catch (e) {
      throw new Error('INTERNAL_SERVER_ERROR');
    }
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async deleteComment(@Param('id') id: number, @User('id') userId: number) {
    const deleteComment = await this.postsCommentService.deleteComment(
      id,
      userId,
    );

    if (!deleteComment) {
      throw new Error('Not Exist Comment');
    }

    return {
      message: 'success',
    };
  }
}

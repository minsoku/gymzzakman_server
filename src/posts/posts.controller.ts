import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QueryRunner as QR } from 'typeorm';
import { PostsService } from './posts.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { VoteBooleanType, VoteType } from '../common/types/vote.type';
import { AccessTokenGuard } from '../auth/guard/access-token.guard';
import { IsLoginAccessTokenGuard } from '../auth/guard/isLogin-access-token.guard';
import { postInterface } from '../common/dto/create-post.dto';
import { User } from '../users/decorator/user.decorator';
import { QueryRunner } from '../common/decorator/query-runner.decorator';
import { TransactionInterceptor } from '../common/interceptor/transaction.interceptor';
import { IsLoginUser } from '../users/decorator/isLogin-user.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts(@Query() query: PaginatePostDto) {
    return this.postsService.paginatePosts(query);
  }

  @Get(':id')
  @UseGuards(IsLoginAccessTokenGuard)
  getPostById(
    @Param('id', ParseIntPipe) id: number,
    @IsLoginUser('id') userId: number,
  ) {
    if (!userId) {
      return this.postsService.getPostById(id);
    }
    return this.postsService.getPostByIdWithUser(id, userId);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  @UseInterceptors(FilesInterceptor('files', 3))
  async postPosts(
    @User('id') userId: number,
    @Body() body: postInterface,
    @QueryRunner('qr') qr: QR,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const post = await this.postsService.createPost(userId, body, qr, files);

    return {
      post,
      success: true,
      message: '게시글이 성공적으로 작성되었습니다.',
    };
  }

  @Post(':id/vote')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async votePost(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Query() query: VoteType,
    @QueryRunner('qr') qr: QR,
  ) {
    const queryValue: VoteBooleanType = {
      like: query?.like === 'true',
      disLike: query?.disLike === 'true',
    };
    const reaction = await this.postsService.vote(userId, id, qr, queryValue);
    if (!reaction) {
      throw new HttpException(
        '게시글이 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      reaction,
      message: '게시글이 성공적으로 좋아요 되었습니다.',
    };
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async deletePost(
    @User('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const deletePost = await this.postsService.deletePost(id, userId);
    if (!deletePost) {
      throw new HttpException(
        '게시글이 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      message: '게시글이 성공적으로 삭제되었습니다.',
    };
  }
}

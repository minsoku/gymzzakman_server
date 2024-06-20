import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { COMMENTS } from './entites/comment.entity';
import { Repository } from 'typeorm';

interface ICreateCommentBody {
  postId: number;
  content: string;
}

@Injectable()
export class PostsCommentService {
  constructor(
    @InjectRepository(COMMENTS)
    private readonly PostsCommentRepository: Repository<COMMENTS>,
  ) {}

  async getCommentsByPostId(postId: number) {
    return this.PostsCommentRepository.find({
      relations: {
        author: true,
      },
      where: {
        post: {
          id: postId,
        },
      },
    });
  }

  async createComment(authorId: number, body: ICreateCommentBody) {
    const { postId, content } = body;
    const post = this.PostsCommentRepository.create({
      author: { id: authorId },
      post: { id: postId },
      content,
    });
    return await this.PostsCommentRepository.save(post);
  }

  async deleteComment(commentId: number, userId: number) {
    const findComment = await this.PostsCommentRepository.findOne({
      relations: {
        author: true,
      },
      where: {
        id: commentId,
      },
    });

    // if the comment exists
    if (!findComment) {
      throw new Error('Not Exist Comment');
    }
    // if the user is the author of the comment
    if (userId !== findComment.author.id) {
      throw new Error('Not Authorized');
    }
    return await this.PostsCommentRepository.delete(commentId);
  }
}

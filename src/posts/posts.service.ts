import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { POSTS } from './entities/post.entity';
import { QueryRunner, Repository } from 'typeorm';
import { REACTIONS } from './entities/reaction.entity';
import { AwsService } from '../aws/aws.service';
import { CommonService } from '../common/common.service';
import { postInterface } from '../common/dto/create-post.dto';
import { VoteBooleanType } from '../common/types/vote.type';
import { HASHTAGS } from './entities/hashtags.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(POSTS)
    private readonly postsRepository: Repository<POSTS>,
    @InjectRepository(REACTIONS)
    private readonly reactionsRepository: Repository<REACTIONS>,
    @InjectRepository(HASHTAGS)
    private readonly hashtagsRepository: Repository<HASHTAGS>,
    private readonly awsService: AwsService,
    private readonly commonService: CommonService,
  ) {}
  async paginatePosts(dto: PaginatePostDto) {
    try {
      return this.commonService.paginate(dto, this.postsRepository);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'INTERNAL_SERVER_ERROR',
        err.message,
      );
    }
  }

  async incrementViewCount(post: POSTS): Promise<POSTS> {
    post.viewCount += 1;
    return this.postsRepository.save(post);
  }

  async getPostById(id: number): Promise<POSTS> {
    const post = await this.postsRepository.findOne({
      relations: ['author', 'images', 'comments', 'comments.author'],
      where: {
        id,
      },
    });

    if (!post) {
      throw new HttpException('POSTS_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const likeCount = await this.reactionsRepository
      .createQueryBuilder('reaction')
      .where('reaction.postId = :postId', { postId: id })
      .andWhere('reaction.isLiked = true')
      .getCount();
    const disLikeCount = await this.reactionsRepository
      .createQueryBuilder('reaction')
      .where('reaction.postId = :postId', { postId: id })
      .andWhere('reaction.isDisLiked = true')
      .getCount();

    post.likeCount = likeCount;
    post.dislikeCount = disLikeCount;

    return this.incrementViewCount(post);
  }

  async getPostByIdWithUser(id: number, userId: number) {
    const post = await this.postsRepository.findOne({
      relations: [
        'author',
        'images',
        'comments',
        'comments.author',
        'hashtags',
      ],
      where: {
        id,
      },
    });

    if (!post) {
      throw new HttpException('POSTS_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const likeCount = await this.reactionsRepository
      .createQueryBuilder('reaction')
      .where('reaction.postId = :postId', { postId: id })
      .andWhere('reaction.isLiked = true')
      .getCount();
    const disLikeCount = await this.reactionsRepository
      .createQueryBuilder('reaction')
      .where('reaction.postId = :postId', { postId: id })
      .andWhere('reaction.isDisLiked = true')
      .getCount();

    post.likeCount = likeCount;
    post.dislikeCount = disLikeCount;

    const isReaction = await this.reactionsRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        post: {
          id,
        },
      },
      relations: {
        user: true,
      },
    });
    if (isReaction) {
      post.isLiked = isReaction.isLiked;
      post.isDisLiked = isReaction.isDisLiked;
    }

    return this.incrementViewCount(post);
  }

  getRepository(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository<POSTS>(POSTS) : this.postsRepository;
  }

  async createPost(
    authorId: number,
    postDto: postInterface,
    qr?: QueryRunner,
    files?: Array<Express.Multer.File>,
  ) {
    const images = [];
    for (let i = 0; i < files.length; i++) {
      const image = await this.awsService.saveImage(files[i], 'posts');
      const imageModel = await this.commonService.saveReviewPostImage(image, i);
      images.push(imageModel);
    }

    const repository = this.getRepository(qr);

    const existingHashtags = postDto.hashtags
      ? await this.getOrCreateHashtags(postDto.hashtags)
      : null;

    const post = repository.create({
      author: {
        id: authorId,
      },
      title: postDto.title,
      content: postDto.content,
      category: postDto.category,
      lat: postDto.lat,
      lng: postDto.lng,
      hashtags: existingHashtags,
      images,
    });

    return await repository.save(post);
  }

  private async getOrCreateHashtags(hashtags: string[]): Promise<HASHTAGS[]> {
    const existingHashtags = await this.hashtagsRepository.findByIds(hashtags);
    const newHashtags = hashtags
      .filter((name) => !existingHashtags.some((h) => h.name === name))
      .map((name) => this.hashtagsRepository.create({ name }));
    const result = await this.hashtagsRepository.save(newHashtags);
    return [...existingHashtags, ...result];
  }

  vote(
    userId: number,
    postId: number,
    qr?: QueryRunner,
    query?: VoteBooleanType,
  ) {
    return this.commonService.votePost(userId, postId, qr, query);
  }

  async deletePost(id: number, userId: number) {
    const post = await this.postsRepository.findOne({
      relations: {
        author: true,
      },
      where: {
        id,
      },
    });

    if (!post) {
      throw new HttpException('POST_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (userId !== post.author.id) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }
    return this.postsRepository.delete(post.id);
  }
}

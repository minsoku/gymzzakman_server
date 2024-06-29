import { BadRequestException, Injectable } from '@nestjs/common';
import { BasePaginationDto } from './dto/base-pagination.dto';
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  QueryRunner,
  Repository,
} from 'typeorm';
import { BASE } from './entities/base.entity';
import { POSTS_IMAGES } from '../posts/entities/post_images.entity';
import { REACTIONS } from '../posts/entities/reaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FILTER_MAPPER } from './const/filter-mapper.const';
import { VoteBooleanType } from './types/vote.type';
import { categoryArr } from './const/categoryArr';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(POSTS_IMAGES)
    private readonly imageRepository: Repository<POSTS_IMAGES>,
    @InjectRepository(REACTIONS)
    private readonly reactionRepository: Repository<REACTIONS>,
  ) {}

  async saveReviewPostImage(url: string, order: number) {
    const image = this.imageRepository.create({
      url,
      order,
    });
    return this.imageRepository.save(image);
  }

  async paginate<T extends BASE>(
    dto: BasePaginationDto,
    repository: Repository<T>,
  ) {
    const findOptions = this.composeFindOptions<T>(dto);
    const [data, count] = await repository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.author', 'user')
      .leftJoinAndSelect('posts.hashtags', 'hashtags')
      .leftJoinAndSelect('posts.comments', 'comments')
      .leftJoinAndSelect('comments.author', 'commentAuthor')
      .select([
        'posts.id',
        'posts.title',
        'posts.content',
        'posts.category',
        'posts.createdAt',
        'posts.viewCount',
        'posts.likeCount',
        'user.id',
        'user.nickname',
        'user.profileImage',
        'hashtags',
        'comments',
        'commentAuthor.nickname',
        'commentAuthor.profileImage',
      ])
      .where(findOptions.where)
      .orderBy(
        'posts.' + Object.keys(findOptions.order)[0],
        Object.values(findOptions.order)[0],
      )
      .skip(findOptions.skip)
      .take(findOptions.take)
      .getManyAndCount();

    await Promise.all(
      data.map(async (post: any) => {
        post.likeCount = await this.reactionRepository
          .createQueryBuilder('reaction')
          .where('reaction.postId = :postId', { postId: post.id })
          .andWhere('reaction.isLiked = true')
          .getCount();
        return post;
      }),
    );
    return {
      data,
      total: count,
    };
  }

  private composeFindOptions<T extends BASE>(
    dto: BasePaginationDto,
  ): FindManyOptions<T> {
    let where: FindOptionsWhere<T> = {};
    let order: FindOptionsOrder<T> = {};
    for (const [key, value] of Object.entries(dto)) {
      if (key.startsWith('where__')) {
        where = {
          ...where,
          ...this.parseWhereFilter(key, value),
        };
      } else if (key.startsWith('order__')) {
        order = {
          ...order,
          ...this.parseWhereFilter(key, value),
        };
      } else if (key === 'category' && categoryArr.indexOf(value) >= 0) {
        where = {
          ...where,
          category: value,
        };
      } else if (key === 'search') {
        where = {
          ...where,
          content: FILTER_MAPPER.i_like(`%${value}%`),
        };
      }
    }

    return {
      where,
      order,
      take: dto.take,
      skip: dto.page ? dto.take * (dto.page - 1) : null,
    };
  }

  private parseWhereFilter<T extends BASE>(
    key: string,
    value: any,
  ): FindOptionsWhere<T> | FindOptionsOrder<T> {
    const options: FindOptionsWhere<T> = {};

    const split = key.split('__');

    if (split.length !== 2 && split.length !== 3) {
      throw new BadRequestException(
        `where 필터는 '__'로 split 했을 때 길이가 2 또는 2이여합니다. - 문제되는 키값${key}`,
      );
    }

    if (split.length === 2) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, field] = split;
      options[field] = value;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, field, operator] = split;
      if (operator === 'i_like') {
        options[field] = FILTER_MAPPER[operator](`%${value}%`);
      } else {
        options[field] = FILTER_MAPPER[operator](value);
      }
    }
    return options;
  }

  async votePost(
    userId: number,
    id: number,
    qr: QueryRunner,
    query: VoteBooleanType,
  ) {
    const existingVote = await this.reactionRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        post: {
          id,
        },
      },
    });
    if (existingVote) {
      if (
        (existingVote.isLiked && query.like) ||
        (existingVote.isDisLiked && query.like)
      ) {
        existingVote.isLiked = !existingVote.isLiked;
        return await this.reactionRepository.save(existingVote);
      }
      if (
        (existingVote.isDisLiked && query.disLike) ||
        (existingVote.isLiked && query.disLike)
      ) {
        existingVote.isDisLiked = !existingVote.isDisLiked;
        return await this.reactionRepository.save(existingVote);
      }
      existingVote.isLiked = query.like;
      existingVote.isDisLiked = query.disLike;
      return await this.reactionRepository.save(existingVote);
    } else {
      const createVote = this.reactionRepository.create({
        user: {
          id: userId,
        },
        post: {
          id,
        },
        isLiked: query.like,
        isDisLiked: query.disLike,
      });
      return this.reactionRepository.save(createVote);
    }
  }
}

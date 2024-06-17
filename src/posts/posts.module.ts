import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { CommonModule } from '../common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { REACTIONS } from './entities/reaction.entity';
import { AwsModule } from '../aws/aws.module';
import { POSTS } from './entities/post.entity';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { HASHTAGS } from './entities/hashtags.entity';

@Module({
  imports: [
    CommonModule,
    AwsModule,
    CommonModule,
    UsersModule,
    AuthModule,
    TypeOrmModule.forFeature([REACTIONS, POSTS, HASHTAGS]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}

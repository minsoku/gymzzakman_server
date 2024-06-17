import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { FitnessCentersModule } from './fitness_centers/fitness_centers.module';
import { USERS } from './users/entities/user.entity';
import { FitnessCenter } from './fitness_centers/entites/fitness_centers.entity';
import { FitnessCoverImage } from './fitness_centers/entites/fitness_cover_images.entity';
import { FitnessCoach } from './fitness_centers/entites/fitness_coaches.entity';
import { FitnessInformation } from './fitness_centers/entites/fitness_informations.entity';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { REACTIONS } from './posts/entities/reaction.entity';
import { POSTS } from './posts/entities/post.entity';
import { COMMENTS } from './comments/entites/comment.entity';
import { FitnessPricesTable } from './fitness_centers/entites/fitness_prices_table.entity';
import { AuthModule } from './auth/auth.module';
import { AwsModule } from './aws/aws.module';
import { UtilModule } from './util/util.module';
import { UtilService } from './util/util.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { POSTS_IMAGES } from './posts/entities/post_images.entity';
import { HASHTAGS } from './posts/entities/hashtags.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env['DB_HOST'],
      port: parseInt(process.env['DB_PORT']),
      username: process.env['DB_USERNAME'],
      password: process.env['DB_PASSWORD'],
      database: process.env['DB_DATABASE_NAME'],
      entities: [
        USERS,
        POSTS,
        POSTS_IMAGES,
        COMMENTS,
        REACTIONS,
        HASHTAGS,
        FitnessCenter,
        FitnessCoverImage,
        FitnessCoach,
        FitnessInformation,
        FitnessPricesTable,
      ],
      synchronize: process.env['DB_SYNCHRONIZE'] === 'true',
    }),
    UsersModule,
    CommonModule,
    FitnessCentersModule,
    PostsModule,
    CommentsModule,
    AuthModule,
    AwsModule,
    UtilModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UtilService,
    {
      provide: APP_INTERCEPTOR, // 모든 응답에 대해 ClassSerializerInterceptor를 적용
      useClass: ClassSerializerInterceptor, // ClassSerializerInterceptor는 응답을 serialize 해준다.
    },
  ],
})
export class AppModule {}

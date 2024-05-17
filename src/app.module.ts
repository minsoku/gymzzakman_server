import { Module } from '@nestjs/common';
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
        COMMENTS,
        REACTIONS,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

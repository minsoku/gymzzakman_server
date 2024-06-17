import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { REACTIONS } from '../posts/entities/reaction.entity';
import { POSTS_IMAGES } from '../posts/entities/post_images.entity';

@Module({
  imports: [TypeOrmModule.forFeature([REACTIONS, POSTS_IMAGES])],
  controllers: [CommonController],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}

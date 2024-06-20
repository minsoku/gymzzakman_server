import { DataSource } from 'typeorm';
import { USERS } from '../users/entities/user.entity';
import { POSTS } from '../posts/entities/post.entity';
import { COMMENTS } from '../comments/entites/comment.entity';
import { HASHTAGS } from '../posts/entities/hashtags.entity';
import { FitnessCenter } from '../fitness_centers/entites/fitness_centers.entity';
import { FitnessPricesTable } from '../fitness_centers/entites/fitness_prices_table.entity';
import { POSTS_IMAGES } from '../posts/entities/post_images.entity';
import { REACTIONS } from '../posts/entities/reaction.entity';
import { FitnessCoverImage } from '../fitness_centers/entites/fitness_cover_images.entity';
import { FitnessInformation } from '../fitness_centers/entites/fitness_informations.entity';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'minsoku',
  password: '1q2w3e4r',
  database: 'gymzzakman',
  synchronize: false,
  logging: false,
  entities: [
    USERS,
    POSTS,
    POSTS_IMAGES,
    COMMENTS,
    REACTIONS,
    HASHTAGS,
    FitnessCenter,
    FitnessCoverImage,
    FitnessInformation,
    FitnessPricesTable,
  ],
  migrations: ['src/migration/*.ts'],
  subscribers: [],
});

export default AppDataSource;

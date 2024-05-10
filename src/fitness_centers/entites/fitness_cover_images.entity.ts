import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FitnessCenter } from './fitness_centers.entity';

@Entity('FITNESS_COVER_IMAGES')
export class FitnessCoverImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

  @ManyToOne(() => FitnessCenter, (fitnessCenter) => fitnessCenter.coverImages)
  fitnessCenter: FitnessCenter;
}

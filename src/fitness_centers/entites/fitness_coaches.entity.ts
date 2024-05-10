import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FitnessCenter } from './fitness_centers.entity';

@Entity('FITNESS_COACHES')
export class FitnessCoach {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  certification: string;

  @ManyToOne(() => FitnessCenter, (fitnessCenter) => fitnessCenter.coaches)
  fitnessCenter: FitnessCenter;
}

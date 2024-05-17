import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { FitnessCenter } from './fitness_centers.entity';

@Entity('FITNESS_PRICES_TABLE')
export class FitnessPricesTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  month: number;

  @Column()
  price: number;

  @Column()
  order: number;

  @ManyToOne(() => FitnessCenter, (fitnessCenter) => fitnessCenter.pricesTable)
  @JoinColumn()
  fitnessCenter: FitnessCenter;
}

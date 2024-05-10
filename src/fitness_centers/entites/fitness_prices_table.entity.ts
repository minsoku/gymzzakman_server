import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { FitnessPrices } from './fitness_prices.entity';
import { FitnessCenter } from './fitness_centers.entity';

@Entity('FITNESS_PRICES_TABLE')
export class FitnessPricesTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string | null;

  @Column()
  order: number | null;

  @Column()
  one_day: boolean | null;

  @OneToMany(
    () => FitnessPrices,
    (fitnessPrice) => fitnessPrice.fitnessPriceTable,
    {
      cascade: true,
    },
  )
  fitnessPrices: FitnessPrices[] | null;

  @OneToOne(() => FitnessCenter, (fitnessCenter) => fitnessCenter.pricesTable)
  @JoinColumn()
  fitnessCenter: FitnessCenter;
}

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FitnessPricesTable } from './fitness_prices_table.entity';

@Entity('FITNESS_PRICES')
export class FitnessPrices {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  times: number | null;

  @Column()
  type: number | null;

  @Column()
  price: number | null;

  @ManyToOne(
    () => FitnessPricesTable,
    (fitnessPriceTable) => fitnessPriceTable.fitnessPrices,
  )
  fitnessPriceTable: FitnessPricesTable;
}

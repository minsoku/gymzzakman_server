import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { FitnessCoach } from './fitness_coaches.entity';
import { FitnessInformation } from './fitness_informations.entity';
import { FitnessCoverImage } from './fitness_cover_images.entity';
import { FitnessPricesTable } from './fitness_prices_table.entity';
import { JoinColumn } from "typeorm/browser";

@Entity('FITNESS_CENTERS')
export class FitnessCenter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'for_women' })
  forWomen: boolean;

  @Column({ name: 'gym_type' })
  gymType: string;

  @Column()
  calorie: number;

  @Column({ name: 'profile_image' })
  profileImage: string;

  @Column({ name: 'short_addr' })
  shortAddr: string;

  @Column()
  lat: number;

  @Column()
  lng: number;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ name: 'safe_number' })
  safeNumber: string;

  @Column()
  address: string;

  @OneToMany(() => FitnessCoverImage, (coverImage) => coverImage.fitnessCenter)
  coverImages: FitnessCoverImage[];

  @OneToOne(
    () => FitnessInformation,
    (information) => information.fitnessCenter,
  )
  informations: FitnessInformation | null;

  @OneToMany(() => FitnessCoach, (coach) => coach.fitnessCenter)
  coaches: FitnessCoach[] | null;

  @OneToOne(() => FitnessPricesTable, (priceTable) => priceTable.fitnessCenter)
  pricesTable: FitnessPricesTable | null;
}

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

@Entity('FITNESS_CENTERS')
export class FitnessCenter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'profile_image' })
  profileImage: string;

  @Column({ name: 'short_addr' })
  shortAddr: string;

  // 위도
  @Column('decimal', { precision: 10, scale: 8, name: 'lat' })
  lat: number;
  // 경도
  @Column('decimal', { precision: 11, scale: 8, name: 'lng' })
  lng: number;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ name: 'safe_number' })
  safeNumber: string | null;

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

  @OneToMany(() => FitnessPricesTable, (priceTable) => priceTable.fitnessCenter)
  pricesTable: FitnessPricesTable | null;
}

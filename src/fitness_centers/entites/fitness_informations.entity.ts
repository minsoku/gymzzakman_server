import { Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { FitnessCenter } from './fitness_centers.entity';

@Entity('FITNESS_INFORMATIONS')
export class FitnessInformation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean' })
  parkable: boolean;

  @Column({ type: 'boolean', nullable: true })
  is_parking_free: boolean | null;

  @Column({ type: 'int', nullable: true })
  free_parking_time: number | null;

  @Column({ type: 'int', nullable: true })
  charge_parking_time: number | null;

  @Column({ type: 'int', nullable: true })
  charge_parking_price: number | null;

  @Column({ type: 'text', nullable: true })
  parking_extra: string | null;

  @Column({ type: 'boolean' })
  cloth_able: boolean | null;

  @Column({ type: 'boolean', nullable: true })
  is_cloth_free: boolean | null;

  @Column({ type: 'int', nullable: true })
  charge_cloth_time: number | null;

  @Column({ type: 'int', nullable: true })
  charge_cloth_price: number | null;

  @Column({ type: 'text', nullable: true })
  cloth_extra: string | null;

  @Column({ type: 'boolean' })
  lockable: boolean | null;

  @Column({ type: 'boolean', nullable: true })
  is_locker_free: boolean | null;

  @Column({ type: 'int', nullable: true })
  charge_locker_time: number | null;

  @Column({ type: 'int', nullable: true })
  charge_locker_price: number | null;

  @Column({ type: 'text', nullable: true })
  locker_extra: string | null;

  @Column({ type: 'text', nullable: true })
  extra: string | null;

  @OneToOne(() => FitnessCenter, (fitnessCenter) => fitnessCenter.informations)
  @JoinColumn()
  fitnessCenter: FitnessCenter;
}

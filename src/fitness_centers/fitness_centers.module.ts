import { Module } from '@nestjs/common';
import { FitnessCentersService } from './fitness_centers.service';
import { FitnessCentersController } from './fitness_centers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FitnessCenter } from './entites/fitness_centers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FitnessCenter])],
  controllers: [FitnessCentersController],
  providers: [FitnessCentersService],
})
export class FitnessCentersModule {}

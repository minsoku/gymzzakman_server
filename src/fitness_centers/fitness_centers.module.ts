import { Module } from '@nestjs/common';
import { FitnessCentersService } from './fitness_centers.service';
import { FitnessCentersController } from './fitness_centers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FitnessCenter } from './entites/fitness_centers.entity';
import { FitnessPricesTable } from "./entites/fitness_prices_table.entity";

@Module({
  imports: [TypeOrmModule.forFeature([FitnessCenter, FitnessPricesTable])],
  controllers: [FitnessCentersController],
  providers: [FitnessCentersService],
})
export class FitnessCentersModule {}

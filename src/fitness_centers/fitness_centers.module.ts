import { Module } from '@nestjs/common';
import { FitnessCentersService } from './fitness_centers.service';
import { FitnessCentersController } from './fitness_centers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [FitnessCentersController],
  providers: [FitnessCentersService],
})
export class FitnessCentersModule {}

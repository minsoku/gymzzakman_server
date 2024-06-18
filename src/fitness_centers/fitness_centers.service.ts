import { HttpException, Injectable } from '@nestjs/common';
import { FitnessCenter } from './entites/fitness_centers.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FitnessCentersService {
  constructor(
    @InjectRepository(FitnessCenter)
    private readonly fitnessCenterRepository: Repository<FitnessCenter>,
  ) {}

  async getFitnessCenters() {
    const result = await this.fitnessCenterRepository.find({
      relations: ['pricesTable'],
    });
    if (!result) {
      throw new HttpException('Fitness centers not found', 404);
    }
    return result;
  }
}

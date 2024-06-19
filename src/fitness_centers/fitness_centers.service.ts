import { HttpException, Injectable } from '@nestjs/common';
import { FitnessCenter } from './entites/fitness_centers.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FitnessPricesTable } from './entites/fitness_prices_table.entity';

@Injectable()
export class FitnessCentersService {
  constructor(
    @InjectRepository(FitnessCenter)
    private readonly fitnessCenterRepository: Repository<FitnessCenter>,
    @InjectRepository(FitnessPricesTable)
    private readonly fitnessPricesTableRepository: Repository<FitnessPricesTable>,
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

  async getFitnessPriceByFilter(params: any) {
    const newParams = {
      minPrice: parseInt(params.minPrice) * 10000,
      maxPrice: parseInt(params.maxPrice) * 10000,
      minMonth: parseInt(params.minMonth),
      maxMonth: parseInt(params.maxMonth),
    };
    return await this.fitnessPricesTableRepository
      .createQueryBuilder('prices')
      .leftJoinAndSelect('prices.fitnessCenter', 'fitnessCenter')
      .where('prices.price >= :minPrice', { minPrice: newParams.minPrice })
      .andWhere('prices.price <= :maxPrice', { maxPrice: newParams.maxPrice })
      .andWhere('prices.month >= :minMonth', { minMonth: newParams.minMonth })
      .andWhere('prices.month <= :maxMonth', { maxMonth: newParams.maxMonth })
      .orderBy('prices.month', 'ASC')
      .addOrderBy('prices.price', 'ASC')
      .getMany();
  }
}

import { Controller, Get, Query } from '@nestjs/common';
import { FitnessCentersService } from './fitness_centers.service';

@Controller('fitness-centers')
export class FitnessCentersController {
  constructor(private readonly fitnessCentersService: FitnessCentersService) {}

  @Get()
  getAllFitnessCenters() {
    return this.fitnessCentersService.getFitnessCenters();
  }

  @Get('/filter')
  getFitnessPriceByFilter(@Query() filter: any) {
    return this.fitnessCentersService.getFitnessPriceByFilter(filter);
  }
}

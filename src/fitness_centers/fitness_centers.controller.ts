import { Controller } from '@nestjs/common';
import { FitnessCentersService } from './fitness_centers.service';

@Controller('fitness-centers')
export class FitnessCentersController {
  constructor(private readonly fitnessCentersService: FitnessCentersService) {}
}

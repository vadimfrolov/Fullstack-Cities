import { Controller, Get } from '@nestjs/common';
import { CityService } from '../services/city.service';

import { ApiTags } from '@nestjs/swagger';
import { CommonResponse, commonResponse } from 'src/common/output-message';
import { CityEntity } from '../entity/city.entity';

@ApiTags('City Record')
@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  async getAllCities(): Promise<CommonResponse<CityEntity[] | Error>> {
    try {
      const res = await this.cityService.getAllCities();
      return commonResponse(true, 'Get All Cities Successfully', res);
    } catch (e) {
      return commonResponse(false, 'Get All Cities Failed', e);
    }
  }
}

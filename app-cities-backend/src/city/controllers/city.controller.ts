import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CityService } from '../services/city.service';
import { CreateCityRecordDto } from '../dtos/create-city-record.dto';
import { UpdateCityRecordDto } from '../dtos/update-city-record.dto';
import { ApiTags } from '@nestjs/swagger';
import { commonResponse } from 'src/common/output-message';

@ApiTags('City Record')
@Controller('city')
export class CityController {
    constructor(
        private readonly cityService: CityService,
    ) { }

    @Get()
    async getAllCities() {
        try {
            const res = await this.cityService.getAllCities();
            return commonResponse(true, 'Get All Cities Successfully', res);
        } catch (e) {
            return commonResponse(false, 'Get All Cities Failed', e);
        }
    }
}

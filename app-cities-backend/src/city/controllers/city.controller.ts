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

    @Post()
    async createCityRecord(@Body() payload: CreateCityRecordDto) {
        try {
            const res = await this.cityService.createCityRecord(payload);
            return commonResponse(true, 'Create City Record Successfully', res);
        } catch (e) {
            return commonResponse(false, 'Create City Record Failed', e);
        }
    }

    @Get(':roll')
    async getCityRecordByRoll(@Param('roll') roll: number) {
        try {
            const res = await this.cityService.getCityByRoll(roll);
            return commonResponse(true, 'Get City Successfully', res);
        } catch (e) {
            return commonResponse(false, 'Get City Failed', e);
        }
    }

    @Patch(':roll')
    async updateCityRecord(@Param('roll') roll: number, @Body() payload: UpdateCityRecordDto) {
        try {
            const res = await this.cityService.updateCity(roll, payload);
            return commonResponse(true, 'Update City Record Successfully', res);
        } catch (e) {
            return commonResponse(false, 'Update City Failed', e);
        }
    }

    @Delete(':roll')
    async deleteCityRecord(@Param('roll') roll: number) {
        try {
            const res = await this.cityService.deleteRecord(roll);
            return commonResponse(true, 'Delete City Record Successfully', res);
        } catch (e) {
            return commonResponse(false, 'Delete City Record Failed', e);
        }
    }
}

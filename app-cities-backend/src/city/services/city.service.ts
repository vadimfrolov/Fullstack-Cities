import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CityEntity } from '../entity/city.entity';
import { CreateCityRecordDto } from '../dtos/create-city-record.dto';
import { UpdateCityRecordDto } from '../dtos/update-city-record.dto';
import { Repository } from 'typeorm';

@Injectable()
export class CityService {
    constructor(
        @InjectRepository(CityEntity) private readonly cityRepo: Repository<CityEntity>,
    ) { }

    async getAllCities(): Promise<CityEntity[]> {
        try {
            return await this.cityRepo.find();
        } catch (e) {
            throw e;
        }
    }
}

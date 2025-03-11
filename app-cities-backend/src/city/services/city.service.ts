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

    async createCityRecord(payload: CreateCityRecordDto): Promise<CityEntity> {
        try {
            const prev = await this.cityRepo.findOne({
                where: {
                    roll: payload.roll,
                },
            });
            if (prev) {
                throw new BadRequestException('City Already Exists!');
            }
            const newRecord = this.cityRepo.create(payload);
            return await this.cityRepo.save(newRecord);
        } catch (e) {
            throw e;
        }
    }

    async getCityByRoll(roll: number): Promise<CityEntity> {
        try {
            const record = await this.cityRepo.findOne({
                where: {
                    roll: roll,
                },
            });
            if (!record) {
                throw new NotFoundException('Invalid Roll Number');
            }
            return record;
        } catch (e) {
            throw e;
        }
    }

    async updateCity(roll: number, payload: UpdateCityRecordDto): Promise<CityEntity> {
        try {
            const record = await this.cityRepo.findOne({
                where: {
                    roll: roll,
                },
            });
            if (!record) {
                throw new NotFoundException('Invalid Roll Number');
            }
            Object.assign(record, payload);
            await this.cityRepo.update(record.id, record);
            return record;
        } catch (e) {
            throw e;
        }
    }

    async deleteRecord(roll: number) {
        try {
            const record = await this.cityRepo.findOne({
                where: {
                    roll: roll,
                },
            });
            if (!record) {
                throw new NotFoundException('Invalid Roll Number');
            }
            return await this.cityRepo.softDelete(record.id);
        } catch (e) {
            throw e;
        }
    }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from '../city/entity/city.entity';
import { SeedService } from './services/seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CityEntity])
  ],
  providers: [SeedService]
})
export class SeedModule {}

import { Module } from '@nestjs/common';
import { CityController } from './controllers/city.controller';
import { CityService } from './services/city.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityEntity } from './entity/city.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CityEntity])
  ],
  controllers: [CityController],
  providers: [CityService]
})
export class CityModule {}

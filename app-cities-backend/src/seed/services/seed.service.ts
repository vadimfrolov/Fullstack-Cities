import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityEntity } from '../../city/entity/city.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepo: Repository<CityEntity>,
  ) {}

  async onModuleInit() {
    setTimeout(async () => {
      await this.seedCities();
    }, 1000);
  }

  private async seedCities() {
    try {
      console.log('Starting database seeding process...');

      try {
        await this.cityRepo.query('SELECT 1');
        console.log('Database connection verified successfully');
      } catch (dbError) {
        console.error('Database connection error:', dbError);
        return;
      }

      const count = await this.cityRepo.count();
      console.log(`Current city count in database: ${count}`);

      if (count > 0) {
        console.log('Database already seeded with cities');
        return;
      }

      let citiesData;
      let cities = [];
      try {
        const prodPath = path.join(process.cwd(), 'cities.json');
        console.log('Trying to read cities from:', prodPath);
        citiesData = JSON.parse(fs.readFileSync(prodPath, 'utf8'));
        cities = citiesData.cities;
        console.log(
          `Found ${cities.length} cities in JSON file at ${prodPath}`,
        );
      } catch (err) {
        console.log('Error reading from prod path:', err.message);
        try {
          const devPath = path.join(__dirname, '../../../cities.json');
          console.log('Trying to read cities from:', devPath);
          citiesData = JSON.parse(fs.readFileSync(devPath, 'utf8'));
          cities = citiesData.cities;
          console.log(
            `Found ${cities.length} cities in JSON file at ${devPath}`,
          );
        } catch (devErr) {
          console.error('Error reading from dev path:', devErr.message);
          console.log('Creating sample city data');
          cities = [
            {
              name: 'New York City',
              name_native: 'New York City',
              country: 'USA',
              continent: 'North America',
              latitude: '40.730610',
              longitude: '-73.935242',
              population: '8419000',
              founded: '1624',
              landmarks: [
                'Statue of Liberty',
                'Empire State Building',
                'Central Park',
              ],
            },
            {
              name: 'Tokyo',
              name_native: '東京',
              country: 'Japan',
              continent: 'Asia',
              latitude: '35.652832',
              longitude: '139.839478',
              population: '13960000',
              founded: '1603',
              landmarks: ['Tokyo Tower', 'Shibuya Crossing', 'Imperial Palace'],
            },
          ];
        }
      }

      console.log(`Preparing to seed ${cities.length} cities`);

      const cityEntities = cities.map((city) => {
        return this.cityRepo.create({
          name: city.name,
          name_native: city.name_native,
          country: city.country,
          continent: city.continent,
          latitude: city.latitude,
          longitude: city.longitude,
          population: city.population,
          founded: city.founded,
          landmarks: city.landmarks,
        });
      });

      const result = await this.cityRepo.save(cityEntities);
      console.log(`Seeded ${result.length} cities successfully`);

      const verifyCount = await this.cityRepo.count();
      console.log(`Verified city count after seeding: ${verifyCount}`);
    } catch (error) {
      console.error('Error seeding cities:', error.message);
      if (error.stack) {
        console.error(error.stack);
      }
    }
  }
}

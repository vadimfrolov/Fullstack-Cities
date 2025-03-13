import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CityEntity } from '../src/city/entity/city.entity';

describe('CityController (e2e)', () => {
  let app: INestApplication;
  let mockCityRepository;

  const mockCities = [
    { id: 1, name: 'New York', country: 'USA', population: 8000000 },
    { id: 2, name: 'London', country: 'UK', population: 9000000 },
  ];

  beforeEach(async () => {
    mockCityRepository = {
      find: jest.fn().mockResolvedValue(mockCities),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(CityEntity))
      .useValue(mockCityRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/city (GET)', () => {
    it('should return all cities', () => {
      return request(app.getHttpServer())
        .get('/city')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('Get All Cities Successfully');
          expect(res.body.data).toEqual(mockCities);
        });
    });
  });
});

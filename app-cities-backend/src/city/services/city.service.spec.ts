import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityService } from './city.service';
import { CityEntity } from '../entity/city.entity';

describe('CityService', () => {
  let service: CityService;
  let repository: Repository<CityEntity>;

  const mockCities = [
    { id: 1, name: 'New York', country: 'USA', population: 8000000 },
    { id: 2, name: 'London', country: 'UK', population: 9000000 },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CityService,
        {
          provide: getRepositoryToken(CityEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(mockCities),
          },
        },
      ],
    }).compile();

    service = module.get<CityService>(CityService);
    repository = module.get<Repository<CityEntity>>(getRepositoryToken(CityEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllCities', () => {
    it('should return an array of cities', async () => {
      const cities = await service.getAllCities();
      expect(cities).toEqual(mockCities);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should throw an exception if repository throws', async () => {
      jest.spyOn(repository, 'find').mockRejectedValueOnce(new Error('Database error'));
      await expect(service.getAllCities()).rejects.toThrow();
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeedService } from './seed.service';
import { CityEntity } from '../../city/entity/city.entity';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  readFileSync: jest.fn(),
}));

describe('SeedService', () => {
  let service: SeedService;
  let repository: Repository<CityEntity>;
  let mockCities: any[];

  beforeEach(async () => {
    jest.clearAllMocks();

    jest
      .spyOn(global, 'setTimeout')
      .mockImplementation((callback: any, _timeout?: any) => {
        callback();
        return { ref: () => {}, unref: () => {} } as any;
      });

    jest.spyOn(path, 'join').mockImplementation((...args) => {
      if (args[0] === process.cwd() && args[1] === 'cities.json') {
        return '/mock/prod/path/cities.json';
      }
      if (args[args.length - 2] === '../../../cities.json') {
        return '/mock/dev/path/cities.json';
      }
      return jest.requireActual('path').join(...args);
    });

    mockCities = [
      {
        name: 'Test City',
        name_native: 'Test Native',
        country: 'Test Country',
        continent: 'Test Continent',
        latitude: '1.1',
        longitude: '2.2',
        population: '10000',
        founded: '1900',
        landmarks: ['Test Landmark 1', 'Test Landmark 2'],
      },
    ];

    const mockRepository = {
      count: jest.fn(),
      query: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        {
          provide: getRepositoryToken(CityEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SeedService>(SeedService);
    repository = module.get<Repository<CityEntity>>(
      getRepositoryToken(CityEntity),
    );

    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call seedCities on module init with timeout', async () => {
    const seedCitiesSpy = jest.spyOn(service as any, 'seedCities');

    await service.onModuleInit();

    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
    expect(seedCitiesSpy).toHaveBeenCalled();
  });

  it('should skip seeding if cities already exist in database', async () => {
    jest.spyOn(repository, 'count').mockResolvedValue(10);
    jest.spyOn(repository, 'query').mockResolvedValue([]);

    await (service as any).seedCities();

    expect(repository.count).toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('should handle database connection error', async () => {
    jest
      .spyOn(repository, 'query')
      .mockRejectedValue(new Error('DB connection failed'));

    await (service as any).seedCities();

    expect(repository.query).toHaveBeenCalledWith('SELECT 1');
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('should read cities from production path', async () => {
    jest.spyOn(repository, 'count').mockResolvedValue(0);
    jest.spyOn(repository, 'query').mockResolvedValue([]);

    (fs.readFileSync as jest.Mock).mockImplementationOnce((path, encoding) => {
      if (path === '/mock/prod/path/cities.json' && encoding === 'utf8') {
        return JSON.stringify({ cities: mockCities });
      }
      throw new Error('Unexpected file path');
    });

    jest
      .spyOn(repository, 'create')
      .mockImplementation((entity) => entity as CityEntity);
    jest
      .spyOn(repository, 'save')
      .mockResolvedValue(mockCities as unknown as CityEntity);

    await (service as any).seedCities();

    expect(fs.readFileSync).toHaveBeenCalledWith(
      '/mock/prod/path/cities.json',
      'utf8',
    );
    expect(repository.create).toHaveBeenCalledTimes(mockCities.length);
    expect(repository.save).toHaveBeenCalled();
  });

  it('should fall back to development path if production path fails', async () => {
    jest.spyOn(repository, 'count').mockResolvedValue(0);
    jest.spyOn(repository, 'query').mockResolvedValue([]);

    const mockProdPath = '/mock/prod/path/cities.json';
    const mockDevPath = '/mock/dev/path/cities.json';

    (path.join as jest.Mock).mockReset();
    (path.join as jest.Mock).mockImplementation((...args) => {
      if (args[0] === process.cwd() && args[1] === 'cities.json') {
        return mockProdPath;
      } else if (
        args[0] === '__dirname' ||
        args[1] === '../../../cities.json'
      ) {
        return mockDevPath;
      }
      return jest.requireActual('path').join(...args);
    });

    const readFileCalls: string[] = [];
    (fs.readFileSync as jest.Mock).mockReset();
    (fs.readFileSync as jest.Mock).mockImplementation((filepath, encoding) => {
      readFileCalls.push(filepath);

      if (filepath === mockProdPath) {
        throw new Error('Production file not found');
      }

      if (filepath === mockDevPath) {
        return JSON.stringify({ cities: mockCities });
      }

      throw new Error(`Unexpected path: ${filepath}`);
    });

    jest
      .spyOn(repository, 'create')
      .mockImplementation((entity) => entity as CityEntity);
    jest
      .spyOn(repository, 'save')
      .mockResolvedValue(mockCities as unknown as CityEntity);

    await (service as any).seedCities();

    expect(readFileCalls).toContain(mockProdPath);
    expect(readFileCalls).toContain(mockDevPath);
    expect(readFileCalls.length).toBe(2);
    expect(readFileCalls[0]).toBe(mockProdPath);
    expect(readFileCalls[1]).toBe(mockDevPath);

    expect(repository.create).toHaveBeenCalledTimes(mockCities.length);
    expect(repository.save).toHaveBeenCalled();
  });

  it('should use hardcoded sample data if both paths fail', async () => {
    jest.spyOn(repository, 'count').mockResolvedValue(0);
    jest.spyOn(repository, 'query').mockResolvedValue([]);

    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('File not found');
    });

    jest
      .spyOn(repository, 'create')
      .mockImplementation((entity) => entity as CityEntity);
    jest
      .spyOn(repository, 'save')
      .mockResolvedValue([{}, {}] as unknown as CityEntity);

    await (service as any).seedCities();

    expect(repository.create).toHaveBeenCalledTimes(2);
    expect(repository.save).toHaveBeenCalled();
  });

  it('should verify data was saved after seeding', async () => {
    jest
      .spyOn(repository, 'count')
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(2);
    jest.spyOn(repository, 'query').mockResolvedValue([]);

    (fs.readFileSync as jest.Mock).mockImplementation(() => {
      throw new Error('File not found');
    });

    jest
      .spyOn(repository, 'create')
      .mockImplementation((entity) => entity as CityEntity);
    jest
      .spyOn(repository, 'save')
      .mockResolvedValue([{}, {}] as unknown as CityEntity);

    await (service as any).seedCities();

    expect(repository.count).toHaveBeenCalledTimes(2);
  });

  it('should handle errors during seeding process', async () => {
    jest.spyOn(repository, 'count').mockResolvedValue(0);
    jest.spyOn(repository, 'query').mockResolvedValue([]);
    jest
      .spyOn(repository, 'create')
      .mockImplementation((entity) => entity as CityEntity);
    jest.spyOn(repository, 'save').mockRejectedValue(new Error('Save failed'));

    const consoleErrorSpy = jest.spyOn(console, 'error');

    await (service as any).seedCities();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error seeding cities:',
      'Save failed',
    );
  });
});

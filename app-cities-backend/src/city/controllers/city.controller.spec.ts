import { Test, TestingModule } from '@nestjs/testing';
import { CityController } from './city.controller';
import { CityService } from '../services/city.service';

const mockCommonResponse = (success, message, data) => ({
  success,
  message,
  data,
});

jest.mock('src/common/output-message', () => ({
  commonResponse: (success, message, data) =>
    mockCommonResponse(success, message, data),
}));

describe('CityController', () => {
  let controller: CityController;
  let service: CityService;

  const mockCities = [
    { id: 1, name: 'New York', country: 'USA', population: 8000000 },
    { id: 2, name: 'London', country: 'UK', population: 9000000 },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CityController],
      providers: [
        {
          provide: CityService,
          useValue: {
            getAllCities: jest.fn().mockResolvedValue(mockCities),
          },
        },
      ],
    }).compile();

    controller = module.get<CityController>(CityController);
    service = module.get<CityService>(CityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllCities', () => {
    it('should return successful response with cities data', async () => {
      const result = await controller.getAllCities();
      expect(result).toEqual({
        success: true,
        message: 'Get All Cities Successfully',
        data: mockCities,
      });
      expect(service.getAllCities).toHaveBeenCalled();
    });

    it('should return error response when service fails', async () => {
      const error = new Error('Service error');
      jest.spyOn(service, 'getAllCities').mockRejectedValueOnce(error);

      const result = await controller.getAllCities();
      expect(result).toEqual({
        success: false,
        message: 'Get All Cities Failed',
        data: error,
      });
    });
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchCities, clearCityCache } from '../src/services/cityService';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('cityService', () => {
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  
  const mockCitiesData = [
    {
      id: '1',
      name: 'Test City',
      name_native: 'Test City Native',
      country: 'Test Country',
      continent: 'Test Continent',
      latitude: '0',
      longitude: '0',
      population: '1000000',
      founded: '2000',
      landmarks: ['Landmark 1', 'Landmark 2'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null
    }
  ];

  const mockSuccessResponse = {
    success: true,
    message: 'Cities fetched successfully',
    data: mockCitiesData
  };

  beforeEach(() => {
    console.log = vi.fn();
    console.error = vi.fn();
    
    vi.clearAllMocks();
    clearCityCache(); // Reset the cache before each test
  });
  
  afterEach(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  it('should fetch cities from API when cache is empty', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockSuccessResponse)
    });

    const result = await fetchCities();

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/city');
    expect(result).toEqual(mockCitiesData);
  });

  it('should return cached cities when available', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockSuccessResponse)
    });
    await fetchCities();
    mockFetch.mockClear();

    const result = await fetchCities();
    
    expect(mockFetch).not.toHaveBeenCalled();
    expect(result).toEqual(mockCitiesData);
  });

  it('should throw an error when API returns failure status', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ 
        success: false, 
        message: 'Failed to fetch cities' 
      })
    });

    await expect(fetchCities()).rejects.toThrow('Failed to fetch cities');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when fetch fails', async () => {
    const errorMessage = 'Network error';
    mockFetch.mockRejectedValueOnce(new Error(errorMessage));

    await expect(fetchCities()).rejects.toThrow();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should clear the cache when clearCityCache is called', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockSuccessResponse)
    });
    await fetchCities();
    mockFetch.mockClear();

    clearCityCache();

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockSuccessResponse)
    });
    await fetchCities();
    
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});

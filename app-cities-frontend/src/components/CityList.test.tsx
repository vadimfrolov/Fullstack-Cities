import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { CityList } from './CityList';
import * as cityService from '../services/cityService';

vi.mock('../services/cityService', () => ({
  fetchCities: vi.fn(),
}));

describe('CityList Component', () => {
  const mockCities = [
    {
      id: '1',
      name: 'New York',
      name_native: 'New York',
      country: 'USA',
      continent: 'North America',
      latitude: '40.7128',
      longitude: '74.0060',
      population: '8336817',
      founded: '1624',
      landmarks: ['Statue of Liberty', 'Empire State Building', 'Central Park'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null
    },
    {
      id: '2',
      name: 'Tokyo',
      name_native: '東京',
      country: 'Japan',
      continent: 'Asia',
      latitude: '35.6762',
      longitude: '139.6503',
      population: '13929286',
      founded: '1457',
      landmarks: ['Tokyo Tower', 'Senso-ji', 'Meiji Shrine'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null
    }
  ];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should show loading state initially', () => {
    vi.mocked(cityService.fetchCities).mockReturnValue(new Promise(() => {})); // Never resolves
    
    render(<CityList />);
    
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
  });

  it('should display error message when fetch fails', async () => {
    vi.mocked(cityService.fetchCities).mockRejectedValue(new Error('Failed to fetch'));
    
    render(<CityList />);
    
    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
      expect(screen.getByText('Failed to load cities')).toBeInTheDocument();
    });
  });

  it('should render cities when fetch is successful', async () => {
    vi.mocked(cityService.fetchCities).mockResolvedValue(mockCities);
    
    render(<CityList />);
    
    await waitFor(() => {
      expect(screen.getByTestId('city-list-title')).toBeInTheDocument();
      expect(screen.getByTestId('city-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('city-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('city-name-1')).toHaveTextContent('New York');
      expect(screen.getByTestId('city-name-2')).toHaveTextContent('Tokyo');
      expect(screen.getByTestId('landmark-1-0')).toHaveTextContent('Statue of Liberty');
      expect(screen.getByTestId('landmark-2-0')).toHaveTextContent('Tokyo Tower');
    });
  });

  it('should display "No cities found" when empty array is returned', async () => {
    vi.mocked(cityService.fetchCities).mockResolvedValue([]);
    
    render(<CityList />);
    
    await waitFor(() => {
      expect(screen.getByTestId('no-cities-message')).toBeInTheDocument();
    });
  });

  it('should correctly format population numbers', async () => {
    vi.mocked(cityService.fetchCities).mockResolvedValue(mockCities);
    
    render(<CityList />);
    
    await waitFor(() => {
      expect(screen.getByTestId('city-population-1')).toHaveTextContent('8,336,817');
      expect(screen.getByTestId('city-population-2')).toHaveTextContent('13,929,286');
    });
  });
});

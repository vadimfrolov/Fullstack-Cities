import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { CityList } from './CityList';
import * as cityService from '../services/cityService';

// Mock the cityService module
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
      landmarks: ['Statue of Liberty', 'Empire State Building']
    },
    {
      id: '2',
      name: 'Paris',
      name_native: 'Paris',
      country: 'France',
      continent: 'Europe',
      latitude: '48.8566',
      longitude: '2.3522',
      population: '2161000',
      founded: '250 BC',
      landmarks: ['Eiffel Tower', 'Louvre Museum']
    }
  ];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should show loading state initially', () => {
    vi.mocked(cityService.fetchCities).mockReturnValue(new Promise(() => {})); // Never resolves
    
    render(<CityList />);
    
    expect(screen.getByText('Loading cities...')).toBeInTheDocument();
  });

  it('should display error message when fetch fails', async () => {
    vi.mocked(cityService.fetchCities).mockRejectedValue(new Error('Failed to fetch'));
    
    render(<CityList />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load cities')).toBeInTheDocument();
    });
  });

  it('should render cities when fetch is successful', async () => {
    vi.mocked(cityService.fetchCities).mockResolvedValue(mockCities);
    
    render(<CityList />);
    
    await waitFor(() => {
      expect(screen.getByText('New York')).toBeInTheDocument();
      expect(screen.getByText('Paris')).toBeInTheDocument();
      expect(screen.getByText('Statue of Liberty')).toBeInTheDocument();
      expect(screen.getByText('Eiffel Tower')).toBeInTheDocument();
    });
  });

  it('should display "No cities found" when empty array is returned', async () => {
    vi.mocked(cityService.fetchCities).mockResolvedValue([]);
    
    render(<CityList />);
    
    await waitFor(() => {
      expect(screen.getByText('No cities found')).toBeInTheDocument();
    });
  });

  it('should correctly format population numbers', async () => {
    vi.mocked(cityService.fetchCities).mockResolvedValue(mockCities);
    
    render(<CityList />);
    
    await waitFor(() => {
      expect(screen.getByText(/8,336,817/)).toBeInTheDocument(); // New York's population
      expect(screen.getByText(/2,161,000/)).toBeInTheDocument(); // Paris's population
    });
  });
});

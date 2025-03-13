import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';
import * as CityListModule from '../src/components/CityList';

// Mock the CityList component
vi.mock('../src/components/CityList', () => ({
  CityList: vi.fn(() => <div data-testid="mock-city-list">City List Mock</div>)
}));

describe('App Component', () => {
  it('should render without crashing', () => {
    render(<App />);
    expect(document.querySelector('.App')).toBeInTheDocument();
  });

  it('should render the CityList component', () => {
    render(<App />);
    expect(screen.getByTestId('mock-city-list')).toBeInTheDocument();
    expect(CityListModule.CityList).toHaveBeenCalled();
  });
});

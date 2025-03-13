export interface City {
  id: string;
  name: string;
  name_native: string;
  country: string;
  continent: string;
  latitude: string;
  longitude: string;
  population: string;
  founded: string;
  landmarks: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

let cachedCities: City[] | null = null;

export async function fetchCities(): Promise<City[]> {
  if (cachedCities) {
    console.log("Returning cached cities data");
    return cachedCities;
  }

  try {
    const response = await fetch("http://localhost:3000/api/city");
    const result = (await response.json()) as ApiResponse<City[]>;

    if (!result.success) {
      throw new Error(result.message);
    }

    cachedCities = result.data;
    return result.data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
}

export function clearCityCache(): void {
  cachedCities = null;
}

import { useEffect, useState, useRef } from "react";
import { fetchCities, City } from "../services/cityService";
import "./CityList.css";

export function CityList() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestMadeRef = useRef(false);

  useEffect(() => {
    if (requestMadeRef.current) return;

    const loadCities = async () => {
      try {
        console.log("Fetching cities data...");
        requestMadeRef.current = true;
        const data = await fetchCities();
        setCities(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load cities");
        setLoading(false);
      }
    };

    loadCities();

    return () => {};
  }, []);

  if (loading) return <div data-testid="loading-state" className="loading">Loading cities...</div>;
  if (error) return <div data-testid="error-state" className="error">{error}</div>;

  return (
    <div data-testid="city-list" className="city-list">
      <h2 data-testid="city-list-title">World Cities</h2>
      {cities.length === 0 ? (
        <p data-testid="no-cities-message">No cities found</p>
      ) : (
        <div data-testid="city-cards" className="city-cards">
          {cities.map((city) => (
            <div key={city.id} data-testid={`city-card-${city.id}`} className="city-card">
              <div className="city-header">
                <h3 data-testid={`city-name-${city.id}`}>{city.name}</h3>
                <h4 data-testid={`city-native-name-${city.id}`} className="native-name">{city.name_native}</h4>
              </div>
              <div className="city-info">
                <p>
                  <strong>Country:</strong>{city.country}
                </p>
                <p>
                  <strong>Continent:</strong>{city.continent}
                </p>
                <p data-testid={`city-population-${city.id}`}>
                  <strong>Population:</strong>{" "}
                  {parseInt(city.population).toLocaleString()}
                </p>
                <p>
                  <strong>Founded:</strong> {city.founded}
                </p>
                {city.landmarks && city.landmarks.length > 0 && (
                  <div className="landmarks">
                    <p>
                      <strong>Landmarks:</strong>
                    </p>
                    <ul data-testid={`city-landmarks-${city.id}`} className="landmark-list">
                      {city.landmarks.map((landmark, index) => (
                        <li key={index} data-testid={`landmark-${city.id}-${index}`}>{landmark}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="coordinates">
                  <p>
                    <strong>Coordinates:</strong> {city.latitude},{" "}
                    {city.longitude}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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

  if (loading) return <div className="loading">Loading cities...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="city-list">
      <h2>World Cities</h2>
      {cities.length === 0 ? (
        <p>No cities found</p>
      ) : (
        <div className="city-cards">
          {cities.map((city) => (
            <div key={city.id} className="city-card">
              <div className="city-header">
                <h3>{city.name}</h3>
                <h4 className="native-name">{city.name_native}</h4>
              </div>
              <div className="city-info">
                <p>
                  <strong>Country:</strong> {city.country}
                </p>
                <p>
                  <strong>Continent:</strong> {city.continent}
                </p>
                <p>
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
                    <ul className="landmark-list">
                      {city.landmarks.map((landmark, index) => (
                        <li key={index}>{landmark}</li>
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

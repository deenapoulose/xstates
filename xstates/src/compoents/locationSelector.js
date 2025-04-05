import React, { useState, useEffect } from "react";
import {
  Typography,
  CircularProgress,
  Alert,
  Container,
  FormControl,
} from "@mui/material";

const LocationSelector = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getCountries = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://crio-location-selector.onrender.com/countries"
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setCountries(data);
      } catch (e) {
        setError("Error fetching countries");
      } finally {
        setLoading(false);
      }
    };
    getCountries();
  }, []);

  const fetchStates = async (country) => {
    if (!country) return;
    try {
      const res = await fetch(
        `https://crio-location-selector.onrender.com/country=${country}/states`
      );
      if (!res.ok) throw new Error("Failed to fetch states");
      const data = await res.json();
      setStates(data);
      setSelectedState("");
      setCities([]);
    } catch (error) {
      setError("Error fetching states");
    }
  };

  const fetchCities = async (country, state) => {
    if (!country || !state) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://crio-location-selector.onrender.com/country=${country}/state=${state}/cities`
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCities(data);
      setSelectedCity("");
    } catch (e) {
      setError("Error fetching cities");
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedState("");
    setSelectedCity("");
    fetchStates(country);
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedCity("");
    fetchCities(selectedCountry, state);
  };

  return (
    <Container sx={{ textAlign: "center", mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Location Selector
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      <FormControl fullWidth sx={{ mt: 3 }}>
        <select
          value={selectedCountry}
          onChange={handleCountryChange}
          data-testid="country-select"
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </FormControl>

      <FormControl fullWidth sx={{ mt: 3 }}>
        <select
          value={selectedState}
          onChange={handleStateChange}
          disabled={!selectedCountry || states.length === 0}
          data-testid="state-select"
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </FormControl>

      <FormControl fullWidth sx={{ mt: 3 }}>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          disabled={!selectedState || cities.length === 0}
          data-testid="city-select"
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </FormControl>

      {selectedCity && (
        <Typography variant="h6" sx={{ mt: 4 }}>
          You selected {selectedCity}, {selectedState}, {selectedCountry}
        </Typography>
      )}
    </Container>
  );
};

export default LocationSelector;

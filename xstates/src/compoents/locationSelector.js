import React, { useState, useEffect } from "react";
import {
  FormControl,
  MenuItem,
  Select,
  Typography,
  CircularProgress,
  Alert,
  Container,
  Grid,
} from "@mui/material";
const LoactionSelector = () => {
  const [countries, setCountries] = useState([]);
  const[states,setStates]=useState([]);
  const[city,setCities]=useState([]);

  const [load, setLoad] = useState(false);
  const [err, setErr] = useState(false);
  
  const [selectedCountry, setSelectedCuntry] = useState("");
  const[selectedState,setSelectedState]=useState("");
  const[selectedCity,setSelectedCity]=useState("");
  const getCountries = async () => {
    setLoad(true);
    try {
      const response = await fetch("https://crio-location-selector.onrender.com/countries");
      if (!response.ok) throw new Error("Failed to fetch countries");
      const data = await response.json();
      setCountries(data);
    } catch (err) {
      setErr("Error fetching countries");
      console.error("Error fetching countries:", err);
    } finally {
      setLoad(false);
    }
  };
  
  useEffect(()=>{
  
    getCountries();
  },[])
  const getStates = async (country) => {
    setLoad(true);
    try {
      const response = await fetch(`https://crio-location-selector.onrender.com/country=${country}/states`);
      if (!response.ok) throw new Error("Failed to fetch states");
      const data = await response.json();
      setStates(data);
      setCities([]);
      setSelectedState("");
      setSelectedCity("");
    } catch (err) {
      setErr("Error fetching states");
      console.error("Error fetching states:", err);
    } finally {
      setLoad(false);
    }
  };
  const getCities = async (country, state) => {
    setLoad(true);
    try {
      const response = await fetch(`https://crio-location-selector.onrender.com/country=${country}/state=${state}/cities`);
      if (!response.ok) throw new Error("Failed to fetch cities");
      const data = await response.json();
      setCities(data);
      setSelectedCity("");
    } catch (err) {
      setErr("Error fetching cities");
      console.error("Error fetching cities:", err);
    } finally {
      setLoad(false);
    }
  };

  return (
    <Container sx={{ textAlign: "centre",mt:5 }}>
      <Typography variant="h4" >Location Selector</Typography>
      {load && <CircularProgress data-testid="loader" />}
      {err && <Alert severity="error">{err}</Alert>}
    
      <FormControl fullWidth >
        <Select
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCuntry(e.target.value);
            getStates(e.target.value);
          }}
          displayEmpty
           data-testid="country-select"
        >
          <MenuItem value="" disabled>
            Select Country
          </MenuItem>
          {countries.map((country) => (
            <MenuItem key={country} value={country}>
              {country}
            </MenuItem>
          ))}
        </Select>{" "}
      </FormControl>
 
      <FormControl fullWidth>
        <Select
        disabled={!selectedCountry}
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            getCities(selectedCountry,e.target.value);
          }}
          displayEmpty
          data-testid="state-select"
        >
          <MenuItem value="" disabled>
            Select State
          </MenuItem>
          {states.map((state) => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          ))}
        </Select>{" "}
      </FormControl>

      <FormControl fullWidth>
        <Select
        disabled={!selectedState}
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value);
          }}
          displayEmpty
          data-testid="city-select"
        >
          <MenuItem value="" disabled>
            Select City
          </MenuItem>
          {city.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>{" "}
      </FormControl>
      
      {selectedCity && (
        <Typography variant="h6" sx={{ mt: 3 }} data-testid="selected-location">
          You selected {selectedCity}, {selectedState}, {selectedCountry}
        </Typography>
      )}
    </Container>

  );
};
export default LoactionSelector;

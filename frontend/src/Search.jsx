import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaFilter, FaMap, FaMoneyBillWave } from "react-icons/fa";
import { Autocomplete, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import "./Search.css";

const SearchBar = () => {
  const [hotels, setHotels] = useState([]);
  const [destination, setDestination] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [numGuests, setNumGuests] = useState("1");
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [mapLocation, setMapLocation] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [minPrice, setMinPrice] = useState(""); // Minimum price state
  const [maxPrice, setMaxPrice] = useState(""); // Maximum price state
  const [exchangeRates, setExchangeRates] = useState({});
  const navigate = useNavigate();

  // Sample UK cities and their corresponding coordinates for mapping
  const cityCoordinates = {
    Aberdeen: { lat: 57.1497, lng: -2.0943 },
    Belfast: { lat: 54.5973, lng: -5.9301 },
    Birmingham: { lat: 52.4862, lng: -1.8904 },
    Bristol: { lat: 51.4545, lng: -2.5879 },
    Cardiff: { lat: 51.5074, lng: -3.1791 },
    Edinburgh: { lat: 55.9533, lng: -3.1883 },
    Glasgow: { lat: 55.8642, lng: -4.2518 },
    London: { lat: 51.5074, lng: -0.1278 },
    Manchester: { lat: 53.4808, lng: -2.2426 },
    Newcastle: { lat: 54.9784, lng: -1.6177 },
    Norwich: { lat: 52.6282, lng: 1.2993 },
    Nottingham: { lat: 52.9548, lng: -1.1581 },
    Oxford: { lat: 51.7546, lng: -1.2549 },
    Plymouth: { lat: 50.3755, lng: -4.1426 },
    Swansea: { lat: 51.6214, lng: -3.9436 },
    Bournemouth: { lat: 50.7196, lng: -1.8808 },
    Kent: { lat: 51.2780, lng: 0.5141 },
  };

  // Fetch exchange rates from API
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/currencies");
        if (!response.ok) {
          throw new Error("Failed to fetch exchange rates.");
        }
        const data = await response.json();
        const rates = data.reduce((acc, { currency_code, rate }) => {
          acc[currency_code] = parseFloat(rate);
          return acc;
        }, {});
        setExchangeRates(rates); // Store the fetched exchange rates
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    fetchExchangeRates();
  }, []);

  // Fetch hotels from the API
  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      setErrorMessage(""); // Reset error message before fetching

      try {
        const response = await fetch("http://localhost:5000/api/hotels");

        if (!response.ok) {
          throw new Error("Failed to fetch hotels.");
        }

        const data = await response.json();
        setHotels(data); // Assuming the API response returns an array of hotels
      } catch (error) {
        setErrorMessage("Error fetching hotel data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // Convert hotel price to selected currency using fetched exchange rates
  const convertPrice = (price) => {
    if (!exchangeRates[selectedCurrency]) return price; // Return original price if conversion rate is not available
    return (price * exchangeRates[selectedCurrency]).toFixed(2);
  };

  // Handle form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    // Clear previous error messages
    setErrorMessage("");

    // Validate input data
    if (!destination.trim()) {
      setErrorMessage("Please enter a destination.");
      return;
    }

    if (!checkInDate || !checkOutDate) {
      setErrorMessage("Please select both check-in and check-out dates.");
      return;
    }

    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      setErrorMessage("Check-out date must be later than check-in date.");
      return;
    }

    if (Number(numGuests) < 1) {
      setErrorMessage("Number of guests must be at least 1.");
      return;
    }

    // Filter hotels based on destination, dates, number of guests, rating, and price range
    const filtered = hotels.filter((hotel) => {
      const city = hotel.city ? hotel.city.toLowerCase() : "";
      const destinationMatch = city.includes(destination.trim().toLowerCase());

      // For simplicity, we assume that the hotel has availability for the given dates and number of guests
      const dateMatch = true; // Placeholder for actual date availability logic
      const guestsMatch = true; // Placeholder for actual guest count logic
      const ratingMatch = hotel.rating >= selectedRating;  // Rating filter logic

      // Price range match
      const priceMatch =
        (!minPrice || hotel.price >= minPrice) &&
        (!maxPrice || hotel.price <= maxPrice);

      return destinationMatch && dateMatch && guestsMatch && ratingMatch && priceMatch;
    });

    if (filtered.length === 0) {
      setErrorMessage("No hotels found for the given search criteria.");
    } else {
      setFilteredHotels(filtered);
      navigate("/SearchResults", {
        state: { hotels: filtered, selectedCurrency: selectedCurrency, exchangeRates: exchangeRates }
      });
    }
  };

  // Modal handlers
  const handleShowFilter = () => setShowFilterModal(true);
  const handleCloseFilter = () => setShowFilterModal(false);
  const handleShowMap = () => {
    setShowMapModal(true);

    // Set the map location based on the destination
    const location = cityCoordinates[destination];
    if (location) {
      setMapLocation(`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14130.859891299282!2d${location.lng}!3d${location.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2snp!4v1736569479768!5m2!1sen!2snp`);
    } else {
      setMapLocation("");  // Handle case where coordinates are not available
    }
  };
  const handleCloseMap = () => setShowMapModal(false);
  const handleShowCurrency = () => setShowCurrencyModal(true);
  const handleCloseCurrency = () => setShowCurrencyModal(false);

  return (
    <div className="search-bar">
      <form className="search-form" onSubmit={handleSearchSubmit}>
        {/* Autocomplete for Destination */}
        <div className="form-group">
          <Autocomplete
            value={destination}
            onChange={(event, newValue) => setDestination(newValue)}
            options={Object.keys(cityCoordinates)} // Use keys from cityCoordinates for suggestions
            renderInput={(params) => (
              <TextField
                style={{ backgroundColor: "white" }}
                {...params}
                label="🔍 Destination"
                className="input-field"
                required
              />
            )}
            freeSolo // Allow typing custom cities that are not in the list
          />
        </div>

        {/* Check-in Date Input */}
        <div className="form-group">
          <input
            type="date"
            className="input-field"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            required
          />
        </div>

        {/* Check-out Date Input */}
        <div className="form-group">
          <input
            type="date"
            className="input-field"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            required
          />
        </div>

        {/* Number of Guests Input */}
        <div className="form-group">
          <select
            className="input-field"
            value={numGuests}
            onChange={(e) => setNumGuests(e.target.value)}
          >
            <option value="1">👤 1 Guest</option>
            <option value="2">👥 2 Guests</option>
            <option value="3">👥 3 Guests</option>
            <option value="4">👥 4+ Guests</option>
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit" className="search-button" disabled={loading}>
          <FaSearch className="icon" /> Search
        </button>
      </form>

      {/* Error Message */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {loading && <div className="loading-message">Loading hotels...</div>}

      <div className="button-group">
        <button className="action-button" onClick={handleShowFilter}>
          <FaFilter className="icon" /> Filters
        </button>
        <button className="action-button" onClick={handleShowMap}>
          <FaMap className="icon" /> Map
        </button>
        <button className="action-button" onClick={handleShowCurrency}>
          <FaMoneyBillWave className="icon" /> Currency
        </button>
      </div>

      {/* Filter Modal */}
      <Dialog open={showFilterModal} onClose={handleCloseFilter}>
        <DialogTitle>🔧 Filter Options</DialogTitle>
        <DialogContent>
          <div className="form-group">
            <InputLabel>Price Range 💸</InputLabel>
            <div className="price-range">
              <input
                type="number"
                className="price-input"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                type="number"
                className="price-input"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <InputLabel>Rating 🌟</InputLabel>
            <FormControl fullWidth>
              <Select
                value={selectedRating}
                onChange={(e) => setSelectedRating(Number(e.target.value))}
              >
                <MenuItem value={0}>All</MenuItem>
                <MenuItem value={1}>1 Star</MenuItem>
                <MenuItem value={2}>2 Stars</MenuItem>
                <MenuItem value={3}>3 Stars</MenuItem>
                <MenuItem value={4}>4 Stars</MenuItem>
                <MenuItem value={5}>5 Stars</MenuItem>
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFilter}>Close</Button>
          <Button onClick={handleCloseFilter}>Apply Filters</Button>
        </DialogActions>
      </Dialog>

      {/* Map Modal */}
      <Dialog open={showMapModal} onClose={handleCloseMap}>
        <DialogTitle>📍 Hotel Location Map</DialogTitle>
        <DialogContent>
          {mapLocation ? (
            <iframe
              src={mapLocation}
              width="100%"
              height="300"
              frameBorder="0"
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
            ></iframe>
          ) : (
            <p>Map location not available for this destination.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMap}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Currency Modal */}
      <Dialog open={showCurrencyModal} onClose={handleCloseCurrency}>
        <DialogTitle>💰 Select Currency</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <Select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
            >
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="GBP">GBP</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
              <MenuItem value="INR">INR</MenuItem>
              {/* Add more currencies as needed */}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCurrency}>Close</Button>
          <Button onClick={handleCloseCurrency}>Apply Currency</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SearchBar;

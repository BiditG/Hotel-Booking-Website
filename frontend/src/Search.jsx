import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaFilter, FaMap, FaMoneyBillWave } from "react-icons/fa";
import { Autocomplete, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import DatePicker from "react-datepicker";  // Importing the React Datepicker component
import "react-datepicker/dist/react-datepicker.css";  // Importing the default styles
import "./Search.css";
import { IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const SearchBar = () => {
  const [hotels, setHotels] = useState([]);
  const [destination, setDestination] = useState("");
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
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
  const [minRoomCapacity, setMinRoomCapacity] = useState(""); // Minimum room capacity state
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

    // Filter hotels based on destination, dates, number of guests, rating, price range, and room capacity
    const filtered = hotels.filter((hotel) => {
      const city = hotel.city ? hotel.city.toLowerCase() : "";
      const destinationMatch = city.includes(destination.trim().toLowerCase());

      const dateMatch = true; // Placeholder for actual date availability logic
      const guestsMatch = true; // Placeholder for actual guest count logic
      const ratingMatch = hotel.rating >= selectedRating;  // Rating filter logic

      // Price range match
      const priceMatch =
        (!minPrice || hotel.price >= minPrice) &&
        (!maxPrice || hotel.price <= maxPrice);

      // Room capacity match
      const roomCapacityMatch = !minRoomCapacity || hotel.room_capacity >= minRoomCapacity;

      return destinationMatch && dateMatch && guestsMatch && ratingMatch && priceMatch && roomCapacityMatch;
    });

    if (filtered.length === 0) {
      setErrorMessage("No hotels found for the given search criteria.");
    } else {
      setFilteredHotels(filtered);
      navigate("/SearchResults", {
        state: { hotels: filtered, selectedCurrency: selectedCurrency, exchangeRates: exchangeRates, destination: destination}
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

  // Get today's date to disable past dates
  const today = new Date();

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
        <div className="form-group date-group">
          <DatePicker
            selected={checkInDate}
            onChange={(date) => setCheckInDate(date)}
            minDate={today}
            placeholderText="Select Check-in Date"
            className="input-field datepicker"
            required
            calendarClassName="custom-calendar"
            customInput={
              <TextField 
                fullWidth 
                label="Check-in Date" 
                variant="outlined" 
                className="datepicker-field" 
                style={{backgroundColor: 'white'}}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setCheckInDate(null)}
                      edge="end"
                      color="secondary"
                    >
                      <CloseIcon />
                    </IconButton>
                  )
                }}
              />
            }
          />
        </div>

        {/* Check-out Date Input */}
        <div className="form-group date-group">
          <DatePicker
            selected={checkOutDate}
            onChange={(date) => setCheckOutDate(date)}
            minDate={today}
            placeholderText="Select Check-out Date"
            className="input-field datepicker"
            required
            calendarClassName="custom-calendar"
            customInput={
              <TextField 
                fullWidth 
                label="Check-out Date" 
                variant="outlined" 
                className="datepicker-field" 
                style={{backgroundColor: 'white'}}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setCheckOutDate(null)}
                      edge="end"
                      color="secondary"
                    >
                      <CloseIcon />
                    </IconButton>
                  )
                }}
              />
            }
          />
        </div>

        {/* Number of Guests Input (Material-UI Select) */}
        <div className="form-group">
          <FormControl fullWidth>
            <InputLabel>Number of Guests</InputLabel>
            <Select
              value={numGuests}
              onChange={(e) => setNumGuests(e.target.value)}
              label="Number of Guests"
              style={{backgroundColor: 'white'}}
            >
              <MenuItem value="1">👤 1 Guest</MenuItem>
              <MenuItem value="2">👥 2 Guests</MenuItem>
              <MenuItem value="3">👥 3 Guests</MenuItem>
              <MenuItem value="4">👥 4+ Guests</MenuItem>
            </Select>
          </FormControl>
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
          <div className="form-group">
            <InputLabel>Room Capacity 🛏️</InputLabel>
            <input
              type="number"
              className="input-field"
              placeholder="Min Room Capacity"
              value={minRoomCapacity}
              onChange={(e) => setMinRoomCapacity(e.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFilter}>Close</Button>
          <Button onClick={handleCloseFilter}>Apply Filters</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SearchBar;


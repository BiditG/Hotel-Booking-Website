import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaFilter, FaMap, FaMoneyBillWave } from "react-icons/fa";
import "./Search.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

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
  const navigate = useNavigate();

  // Fetch hotels from the API
  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      setErrorMessage(""); // Reset error message before fetching

      try {
        // Replace with your actual API endpoint
        const response = await fetch("http://localhost:5000/api/hotels");
        
        if (!response.ok) {
          throw new Error("Failed to fetch hotels.");
        }

        const data = await response.json();
        setHotels(data);  // Assuming the API response returns an array of hotels
      } catch (error) {
        setErrorMessage("Error fetching hotel data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

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

    // Filter hotels based on destination, dates, and number of guests
    const filtered = hotels.filter((hotel) => {
      const city = hotel.city ? hotel.city.toLowerCase() : "";
      const destinationMatch = city.includes(destination.trim().toLowerCase());

      // For simplicity, we assume that the hotel has availability for the given dates and number of guests
      const dateMatch = true; // Placeholder for actual date availability logic
      const guestsMatch = true; // Placeholder for actual guest count logic

      return destinationMatch && dateMatch && guestsMatch;
    });

    if (filtered.length === 0) {
      setErrorMessage("No hotels found for the given search criteria.");
    } else {
      setFilteredHotels(filtered);
      navigate("/SearchResults", { state: { hotels: filtered } });
    }
  };

  // Modal handlers
  const handleShowFilter = () => setShowFilterModal(true);
  const handleCloseFilter = () => setShowFilterModal(false);
  const handleShowMap = () => setShowMapModal(true);
  const handleCloseMap = () => setShowMapModal(false);
  const handleShowCurrency = () => setShowCurrencyModal(true);
  const handleCloseCurrency = () => setShowCurrencyModal(false);

  return (
    <div className="search-bar">
      <form className="search-form" onSubmit={handleSearchSubmit}>
        {/* Destination Input */}
        <div className="form-group">
          <input
            type="text"
            placeholder="🔍 Destination"
            className="input-field"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
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

      {/* Show error message if there is any */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* Show loading state */}
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

      {/* Modals for Filters, Map, and Currency */}
      <Modal show={showFilterModal} onHide={handleCloseFilter} centered>
        <Modal.Header closeButton>
          <Modal.Title><FaFilter className="icon" /> Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="filter-type">
              <Form.Label>Type of Property</Form.Label>
              <Form.Control as="select">
                <option>Hotel</option>
                <option>Apartment</option>
                <option>Hostel</option>
                <option>Resort</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseFilter}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Map Modal */}
      <Modal show={showMapModal} onHide={handleCloseMap} centered>
        <Modal.Header closeButton>
          <Modal.Title><FaMap className="icon" /> Map</Modal.Title>
        </Modal.Header>
        <Modal.Body>Map Content Goes Here</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseMap}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Currency Modal */}
      <Modal show={showCurrencyModal} onHide={handleCloseCurrency} centered>
        <Modal.Header closeButton>
          <Modal.Title><FaMoneyBillWave className="icon" /> Currency</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="currency-select">
            <Form.Label>Select Currency</Form.Label>
            <Form.Control as="select">
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCurrency}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SearchBar;

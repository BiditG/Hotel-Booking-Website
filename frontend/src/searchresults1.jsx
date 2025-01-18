import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import SearchBar from "./Search"; // Import the existing SearchBar component
import axios from "axios"; // Import axios for API requests
import "./SearchResults.css";

const SearchResults1 = () => {
  const location = useLocation();

  // Destructure state passed from Rooms.jsx
  const {
    destination,
    cityData, // Receive cityData
    checkInDate,
    checkOutDate,
    numGuests,
    selectedCurrency,
    exchangeRates,
  } = location.state || {}; // Default to empty object if no state

  // State to manage fetched hotels
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Extract search parameters (priority to passed state)
  const finalDestination = destination || (cityData && cityData.name) || "Unknown Destination";
  const finalCurrency = selectedCurrency || "£"; // Fallback to GBP
  const finalExchangeRates = exchangeRates || {}; // Fallback to empty object if exchange rates are unavailable

  useEffect(() => {
    // Function to fetch hotels from the API
    const fetchHotels = async () => {
      setLoading(true);
      setError(null);

      try {
        // Make a GET request to the hotels API
        const response = await axios.get("http://localhost:5000/api/hotels");

        // Assuming the API returns an array of hotels
        const fetchedHotels = response.data;

        // Debug: Log fetched hotels
        console.log("Fetched Hotels:", fetchedHotels);

        // Filter hotels by the selected city (case-insensitive)
        const filteredHotels = fetchedHotels.filter(
          (hotel) => hotel.city.toLowerCase() === finalDestination.toLowerCase()
        );

        // Debug: Log filtered hotels
        console.log(`Hotels in ${finalDestination}:`, filteredHotels);

        setHotels(filteredHotels);
      } catch (err) {
        console.error("Error fetching hotels:", err);
        setError("Failed to fetch hotels. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // Fetch hotels only if a destination is specified
    if (finalDestination) {
      fetchHotels();
    }
  }, [finalDestination]);

  // Function to convert price based on the selected currency and exchange rates
  const convertPrice = (price) => {
    if (!finalExchangeRates || !finalExchangeRates[finalCurrency]) {
      return price; // Fallback to original price if no valid exchange rate exists
    }
    return (price * finalExchangeRates[finalCurrency]).toFixed(2);
  };

  return (
    <>
      <br />
      <br />
      {cityData && cityData.name ? (
        <SearchBar
          destination={cityData.name}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          numGuests={numGuests}
          selectedCurrency={finalCurrency}
          exchangeRates={finalExchangeRates}
        />
      ) : (
        <SearchBar
          destination={finalDestination}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          numGuests={numGuests}
          selectedCurrency={finalCurrency}
          exchangeRates={finalExchangeRates}
        />
      )}

      <div className="search-results">
        <h2>Search Results for {finalDestination}</h2>

        {/* Display loading indicator */}
        {loading && <p>Loading hotels...</p>}

        {/* Display error message if any */}
        {error && <p className="error-message">{error}</p>}

        {/* Display hotels if available */}
        {!loading && !error && (
          <div className="hotel-cards">
            {hotels && hotels.length > 0 ? (
              hotels.map((hotel) => (
                <div className="hotel-card" key={hotel.id}>
                  <img
                    src={hotel.image || "/default-image.jpg"} // Ensure default image path is correct
                    alt={hotel.name || "Hotel"}
                    className="hotel-image"
                  />
                  <div className="hotel-info">
                    <h4>{hotel.name}</h4>
                    <p className="hotel-description">{hotel.description}</p>
                    <div className="hotel-rating">Rating: {hotel.rating} ⭐</div>
                    <div className="hotel-price">
                      AVERAGE SPENDING: {finalCurrency} {convertPrice(hotel.price)}
                    </div>
                    <div className="buttons">
                      <Link to="/Booking" state={hotel}>
                        <button className="Booknowbutton">Book Now</button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // If no hotels found, display a message
              <p>No hotels found for {finalDestination}.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchResults1;

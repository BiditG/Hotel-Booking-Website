import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import SearchBar from "./Search"; // Import the existing SearchBar component
import "./SearchResults.css";

const SearchResults = () => {
  const location = useLocation();

  // Get state from location
  const {
    hotels,
    selectedCurrency,
    exchangeRates,
    destination,
    checkInDate,
    checkOutDate,
    numGuests,
  } = location.state || {}; // Default to empty object if no state

  // Get additional search data from URL query or other sources
  const searchParams = new URLSearchParams(window.location.search);
  const navbarSelectedCurrency = searchParams.get("selectedCurrency") || selectedCurrency;
  const navbarCheckInDate = searchParams.get("checkInDate") || checkInDate;
  const navbarCheckOutDate = searchParams.get("checkOutDate") || checkOutDate;
  const navbarNumGuests = searchParams.get("numGuests") || numGuests;

  // Combine data (priority to URL state over passed state)
  const finalDestination = destination || searchParams.get("destination") || "Unknown Destination";
  const finalCurrency = navbarSelectedCurrency || "£"; // Fallback to GBP
  const finalExchangeRates = exchangeRates || {}; // Fallback to empty object if exchange rates are unavailable

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
      <SearchBar
        destination={finalDestination}
        checkInDate={navbarCheckInDate}
        checkOutDate={navbarCheckOutDate}
        numGuests={navbarNumGuests}
        selectedCurrency={finalCurrency}
        exchangeRates={finalExchangeRates}
      />

      <div className="search-results">
        <h2>Search Results for {finalDestination}</h2>
        <div className="hotel-cards">
          {hotels && hotels.length > 0 ? (
            hotels.map((hotel) => (
              <div className="hotel-card" key={hotel.id}>
                <img
                  src={hotel.image || "default-image.jpg"}
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
            <p>No hotels found for this destination.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchResults;

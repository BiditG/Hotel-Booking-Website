import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import SearchBar from "./Search"; // Import the existing SearchBar component
import "./SearchResults.css";

const SearchResults = () => {
  const location = useLocation();
  const { hotels, selectedCurrency, exchangeRates, destination, checkInDate, checkOutDate, numGuests } = location.state || {};

  // Function to convert price based on the selected currency and exchange rates
  const convertPrice = (price) => {
    if (!exchangeRates || !exchangeRates[selectedCurrency]) {
      return price; // Fallback to original price if no valid exchange rate exists
    }
    return (price * exchangeRates[selectedCurrency]).toFixed(2);
  };

  return (
    <><br/>
    <br/>
      <SearchBar 
        destination={destination} 
        checkInDate={checkInDate} 
        checkOutDate={checkOutDate} 
        numGuests={numGuests} 
        selectedCurrency={selectedCurrency} 
        exchangeRates={exchangeRates}
       />

      <div className="search-results">
        <h2>Search Results</h2>
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
                    Price: {selectedCurrency} {convertPrice(hotel.price)}
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

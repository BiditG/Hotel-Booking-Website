import React from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "./Search"; // Import the existing SearchBar component
import "./SearchResults.css";

const SearchResults1 = () => {
  const location = useLocation();
  const { destination, cityData } = location.state || {}; // Receive city data

  return (
    <>
      <br />
      <br />
      <SearchBar destination={cityData.name} />

      <div className="search-results">
        <h2>Search Results for {destination}</h2>
        <div className="hotel-cards">
          {cityData ? (
            <div className="hotel-card">
              <img
                src={cityData.image || "default-image.jpg"}
                alt={cityData.name || "Hotel"}
                className="hotel-image"
              />
              <div className="hotel-info">
                <h4>{cityData.name}</h4>
                <p className="hotel-description">
                  Capacity: {cityData.capacity} rooms
                </p>
                <p className="hotel-price">
                  Peak Rate: £{cityData.peakRate} | Off-Peak Rate: £{cityData.offPeakRate}
                </p>
              </div>
            </div>
          ) : (
            <p>No results found for {destination}.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchResults1;

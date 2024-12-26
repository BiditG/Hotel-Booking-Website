import React from "react";
import { useLocation } from "react-router-dom";
import "./SearchResults.css";
import LandingPage from "./LandingPage";
import SearchBar from "./Search";

const SearchResults = () => {
  const location = useLocation();
  const { hotels } = location.state || { hotels: [] };

  return (
    <>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    <SearchBar/>
    <div className="search-results">
      <h2>Search Results</h2>
      <div className="hotel-cards">
        {hotels.length > 0 ? (
          hotels.map((hotel) => (
            <div className="hotel-card" key={hotel.id}>
              <img src={hotel.image || 'default-image.jpg'} alt={hotel.name || 'Hotel'} className="hotel-image" />
              <h4>{hotel.name}</h4>
              <p>{hotel.description}</p>
              <p>Rating: {hotel.rating} ⭐</p>
              <p>Price: £{hotel.price}</p>
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

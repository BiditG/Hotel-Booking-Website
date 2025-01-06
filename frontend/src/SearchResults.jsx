import React from "react";
import { useLocation } from "react-router-dom";
import "./SearchResults.css";
import SearchBar from "./Search";
import { Link } from "react-router-dom";

const SearchResults = () => {
  const location = useLocation();
  const { hotels } = location.state || { hotels: [] };

  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <br />
      <SearchBar />
      <div className="search-results">
        <h2>Search Results</h2>
        <div className="hotel-cards">
          {hotels.length > 0 ? (
            hotels.map((hotel) => (
              <div className="hotel-card" key={hotel.id}>
                <img
                  src={hotel.image || 'default-image.jpg'}
                  alt={hotel.name || 'Hotel'}
                  className="hotel-image"
                />
                <div className="hotel-info">
                  <h4>{hotel.name}</h4>
                  <p className="hotel-description">{hotel.description}</p>
                  <div className="hotel-rating">Rating: {hotel.rating} ⭐</div>
                  <div className="hotel-price">Price: £{hotel.price}</div>
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

import React from "react";
import "./Search.css";
import Button from 'react-bootstrap/Button';

function Search() {
  return (
    <div className="search-container">
      <form id="search-form">
        <div className="form-group">
          
          <label htmlFor="destination">Destination</label>
          <input
          
            type="text"
            id="destination"
            name="destination"
            placeholder="Enter city or hotel name"
            required
            
          />

          
        </div>
        <div className="form-group">
          
          <label htmlFor="checkin-date">Check-in</label>
          <input type="date" id="checkin-date" name="checkin" required />
        </div>
        <div className="form-group">
          <label htmlFor="checkout-date">Check-out</label>
          <input
            type="date"
            id="checkout-date"
            name="checkout"
            required
          />
          
        </div>
        <div className="form-group">
          <label htmlFor="guests">Guests</label>
          <select id="type" name="type">
            <option value="car">1 Guest</option>
            <option value="bike">2 Guests</option>
            <option value="plane">3 Guests</option>
            <option value="boat">4+ Guests</option>
        </select>
        </div>
        <div className="form-group">
          <Button variant="primary" size="lg" className="search-button">Search</Button>
        </div>
      </form>
    </div>
  );
}

export default Search;


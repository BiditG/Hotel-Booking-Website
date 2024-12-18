import React, { useState } from "react";
import "./Search.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function Search() {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  const handleShowFilter = () => setShowFilterModal(true);
  const handleCloseFilter = () => setShowFilterModal(false);

  const handleShowMap = () => setShowMapModal(true);
  const handleCloseMap = () => setShowMapModal(false);

  const handleShowCurrency = () => setShowCurrencyModal(true);
  const handleCloseCurrency = () => setShowCurrencyModal(false);

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
          <input type="date" id="checkout-date" name="checkout" required />
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
          <Button variant="primary" size="lg" className="search-button">
            Search
          </Button>
        </div>
        <div className="modalbutton">
          <div className="form-group">
            <Button
              variant="secondary"
              onClick={handleShowFilter}
              className="secondary-btn"
            >
              Filters
            </Button>
          </div>
          <div className="form-group">
            <Button
              variant="secondary"
              onClick={handleShowMap}
              className="secondary-btn"
            >
              Map
            </Button>
          </div>
          <div className="form-group">
            <Button
              variant="secondary"
              onClick={handleShowCurrency}
              className="secondary-btn"
            >
              Currency
            </Button>
          </div>
        </div>
      </form>

      {/* Filter Modal */}
      <Modal show={showFilterModal} onHide={handleCloseFilter} centered>
        <Modal.Header closeButton>
          <Modal.Title>Filters</Modal.Title>
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

            <Form.Group controlId="filter-price">
              <Form.Label>Price Range</Form.Label>
              <Form.Control as="select">
                <option>Under $100</option>
                <option>$100 - $200</option>
                <option>$200 - $500</option>
                <option>Above $500</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="filter-rating">
              <Form.Label>Rating</Form.Label>
              <Form.Control as="select">
                <option>Any</option>
                <option>1 Star</option>
                <option>2 Stars</option>
                <option>3 Stars</option>
                <option>4 Stars</option>
                <option>5 Stars</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseFilter}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCloseFilter}>
            Apply Filters
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Map Modal */}
      <Modal show={showMapModal} onHide={handleCloseMap} centered>
        <Modal.Header closeButton>
          <Modal.Title>Map</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         <center> <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d28262.487737343203!2d85.34753280000001!3d27.6922368!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2snp!4v1734450337886!5m2!1sen!2snp"
            width={800}
            height={200}
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          /></center>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseMap}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Currency Modal */}
      <Modal show={showCurrencyModal} onHide={handleCloseCurrency} centered>
        <Modal.Header closeButton>
          <Modal.Title>Currency</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="currency-select">
              <Form.Label>Select Currency</Form.Label>
              <Form.Control as="select">
                <option>USD - US Dollar</option>
                <option>EUR - Euro</option>
                <option>GBP - British Pound</option>
                <option>INR - Indian Rupee</option>
                <option>JPY - Japanese Yen</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCurrency}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCloseCurrency}>
            Apply Currency
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Search;

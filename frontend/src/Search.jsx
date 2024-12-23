import React, { useState } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaFilter, FaMap, FaMoneyBillWave, FaSearch } from "react-icons/fa";
import "./Search.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const SearchBar = () => {
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
    <div className="search-bar">
      <form className="search-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="🔍 Destination"
            className="input-field"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="date"
            placeholder="📅 Check-in"
            className="input-field"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="date"
            placeholder="📅 Check-out"
            className="input-field"
            required
          />
        </div>
        <div className="form-group">
          <select className="input-field">
            <option value="1">👤 1 Guest</option>
            <option value="2">👥 2 Guests</option>
            <option value="3">👥 3 Guests</option>
            <option value="4">👥 4+ Guests</option>
          </select>
        </div>
        <button type="submit" className="search-button">
          <FaSearch className="icon" /> Search
        </button>
      </form>
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

      {/* Modals */}
      <Modal show={showFilterModal} onHide={handleCloseFilter} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaFilter className="icon" /> Filters
          </Modal.Title>
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
          <Button variant="secondary" onClick={handleCloseFilter}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showMapModal} onHide={handleCloseMap} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaMap className="icon" /> Map
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Map Content Goes Here</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseMap}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showCurrencyModal} onHide={handleCloseCurrency} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaMoneyBillWave className="icon" /> Currency
          </Modal.Title>
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
          <Button variant="secondary" onClick={handleCloseCurrency}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SearchBar;

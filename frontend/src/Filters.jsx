import React from "react";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import "./Filters.css";

function Filters() {
  return (
    <>
    <div className="filteroverview">
      <Accordion className="custom-accordion">
        <Accordion.Item eventKey="0">
          <Accordion.Header >
            Filters - <ion-icon name="filter-outline"></ion-icon>
          </Accordion.Header>
          <Accordion.Body>
            <div className="Filter-container">
              <h2>Price Range</h2>
              <Form.Label>Range: $50 - $100</Form.Label>
              <Form.Range />

              <h2>Minimum Rating</h2>
              <select id="rating" name="rating">
                <option value="any">Any</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="4.5">4.5+</option>
              </select>

              <br />
              <br />

              <div className="Amenities">
                <h2>Amenities</h2>
                <label htmlFor="wifi">Wifi</label>
                <ion-icon name="wifi-outline"></ion-icon>
                <input type="checkbox" id="wifi" />

                <label htmlFor="gym">Gym</label>
                <input type="checkbox" id="gym" />

                <label htmlFor="parking">Parking</label>
                <ion-icon name="car-outline"></ion-icon>
                <input type="checkbox" id="parking" />

                <label htmlFor="restaurant">Restaurant</label>
                <ion-icon name="pizza-outline"></ion-icon>
                <input type="checkbox" id="restaurant" />
              </div>

              <Button
                variant="primary"
                size="md"
                className="apply-filter-button"
              >
                Apply Filters
              </Button>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion className="custom-accordion" id="cus1" >
        <Accordion.Item eventKey="1" >
          <Accordion.Header className="aheader"  >
            Map - <ion-icon name="map-outline"></ion-icon>
          </Accordion.Header>
          <Accordion.Body >
            <div className="Filter-container">
              <h2>MAP</h2>
              <iframe
                src="https://www.google.com/maps/embed?pb=..."
                width="400"
                height="300"
                style={{ border: "0" }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion className="custom-accordion" id="cus1">
        <Accordion.Item eventKey="1">
          <Accordion.Header className="aheader" >
            Currency - <ion-icon name="card-outline"></ion-icon>
          </Accordion.Header>
          <Accordion.Body>
            <div className="Filter-container">
              <h2>CURRENCY</h2>
              <br />
              <div className="flagcontainer">
                <button>
                  UK POUND<div className="flag"></div>
                </button>
              </div>
              <div className="flagcontainer">
                <button>
                  NEPALI RUPPES<div className="flag1"></div>
                </button>
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      </div>
      <br />
    </>
  );
}

export default Filters;

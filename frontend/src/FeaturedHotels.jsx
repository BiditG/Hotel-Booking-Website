import React, { useState, useEffect, useRef } from "react";
import "./FeaturedHotels.css";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { Link } from "react-router-dom";

function FeaturedHotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  // Fetch hotels data from the Flask API
  useEffect(() => {
    fetch("http://localhost:5000/api/hotels")
      .then((response) => response.json())
      .then((data) => {
        setHotels(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching hotels:", error);
        setLoading(false);
      });
  }, []);

  const hotelCards = hotels.map((hotel, index) => (
    <Card className="Card-container" key={index}>
      <Card.Img
        variant="top"
        src={hotel.image}
        style={{
          width: "100%",
          height: "180px",
          objectFit: "cover",
          borderRadius: "10px 10px 0 0",
        }}
      />
      <Card.Body>
        <Card.Title className="hotel-title" style={{ fontSize: '24px' }}>{hotel.name}</Card.Title>
        <Card.Text className="hotel-description" style={{ fontSize: '16px' }}>
          {hotel.description || "No description available."}
        </Card.Text>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>
          <strong>Amenities:</strong> {hotel.amenities
            ? hotel.amenities.split(",").map(item => item.trim()).join(", ")
            : "No amenities available"}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Rating:</strong> {hotel.rating} 
          <ion-icon
            name="star-sharp"
            size="medium"
            style={{ color: "#1d58a2", position: "relative", top: "1px" }}
          ></ion-icon>
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>AVERAGE SPENDING:</strong> {hotel.price + `$`} 
          <ion-icon
            name="cash-sharp"
            style={{ color: "#1d58a2", position: "relative", top: "2px", left: "5px" }}
          ></ion-icon>
        </ListGroup.Item>
      </ListGroup>
      <Card.Body>
        <Link to="/Booking" state={hotel}>
          <button className="Booknowbutton">Book Now</button>
        </Link>
      </Card.Body>
    </Card>
  ));

  return (
    <>
      <br />
      <div className="Featured-container" style={{ backgroundColor: "whitesmoke" }}>
        <br />
        <center>
          <h2 className="section-title">Featured Hotels</h2>
          <p className="section-description">
            Explore the best hotels with top amenities, great prices, and stellar ratings. Whether you're looking for luxury or budget-friendly stays, we've got you covered.
          </p>
          <div className="hotel-container" ref={scrollContainerRef}>
            {loading ? (
              <div className="loading-spinner">Loading...</div>
            ) : (
              hotelCards
            )}
          </div>
        </center>
      </div>
    </>
  );
}

export default FeaturedHotels;
import React, { useState, useEffect, useRef } from "react";
import "./FeaturedHotels.css";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { Link } from "react-router-dom";

function FeaturedHotels() {
  const [hotels, setHotels] = useState([]);
  const scrollContainerRef = useRef(null);

  // Fetch hotels data from the Flask API
  useEffect(() => {
    fetch("http://localhost:5000/api/hotels")
      .then((response) => response.json())
      .then((data) => setHotels(data))
      .catch((error) => {
        console.error("Error fetching hotels:", error);
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
          borderRadius: "10px 10px 0 0", // Added rounded corners to the image
        }}
      />
      <Card.Body>
        <Card.Title className="hotel-title">{hotel.name}</Card.Title>
        <Card.Text className="hotel-description">{hotel.description}</Card.Text>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>
          Amenities - {Array.isArray(hotel.amenities) ? hotel.amenities.join(", ") : hotel.amenities || "No amenities available"}
        </ListGroup.Item>
        <ListGroup.Item>
          Rating - {hotel.rating}{" "}
          <ion-icon
            name="star-sharp"
            size="medium"
            style={{
              color: "#1d58a2",
              position: "relative",
              top: "1px",
            }}
          ></ion-icon>
        </ListGroup.Item>
        <ListGroup.Item>
          Price - {hotel.price}{" "}
          <ion-icon
            name="cash-sharp"
            style={{
              color: "#1d58a2",
              position: "relative",
              top: "2px",
              left: "5px",
            }}
          ></ion-icon>
        </ListGroup.Item>
      </ListGroup>
      <Card.Body>
        {/* Using Link component from react-router-dom to pass hotel data via state */}
        <Link to="/Booking" state={hotel}>
          <button className="Booknowbutton">Book Now</button>
        </Link>
      </Card.Body>
    </Card>
  ));

  return (
    <>
      <br />
      <center style={{ backgroundColor: "whitesmoke" }}>
        <div className="Featured-container">
          <br />
          <br />
          <h2 className="section-title">Featured Hotels</h2>
          <div className="hotel-container" ref={scrollContainerRef}>
            {hotelCards}
          </div>
        </div>
      </center>
    </>
  );
}

export default FeaturedHotels;

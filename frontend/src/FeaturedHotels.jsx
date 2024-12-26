import React, { useState, useEffect, useRef } from "react";
import "./FeaturedHotels.css";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

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
          height: "220px",
          objectFit: "cover",
          borderRadius: "10px 10px 0 0", // Added rounded corners to the image
        }}
      />
      <Card.Body>
        <Card.Title className="hotel-title">{hotel.name}</Card.Title>
        <Card.Text className="hotel-description">{hotel.description}</Card.Text>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>Amenities - {hotel.amenities}</ListGroup.Item>
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
        <Card.Link href="#">
          <button className="Booknowbutton">Book Now</button>
        </Card.Link>
        <Card.Link href="#">
          <button className="Seedetailsbutton">See Details</button>
        </Card.Link>
      </Card.Body>
    </Card>
  ));

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -410, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 410, behavior: "smooth" });
    }
  };

  return (
    <center style={{ backgroundColor: "whitesmoke" }}>
      <div className="Featured-container">
        <div className="scroll-buttons">
          <button onClick={scrollLeft} className="scroll-btn">
            {"<"}
          </button>
          <button onClick={scrollRight} className="scroll-btn">
            {">"}
          </button>
        </div>
        <h2 className="section-title">Featured Hotels</h2>
        <div className="hotel-container" ref={scrollContainerRef}>
          {hotelCards}
        </div>
      </div>
    </center>
  );
}

export default FeaturedHotels;

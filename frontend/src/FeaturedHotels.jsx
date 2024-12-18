import React, { useRef } from "react";
import "./FeaturedHotels.css";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

function FeaturedHotels({ hotels = [] }) {
  const hotelCards = [];
  const scrollContainerRef = useRef(null);


  for (let i = 0; i < hotels.length; i++) {
    const hotel = hotels[i];

    hotelCards.push(
      <Card className="Card-container" key={i}>
        <Card.Img
          variant="top"
          src={hotel.image}
          style={{ width: "100%", height: "200px", objectFit: "cover",}}
        />
        <Card.Body>
          <Card.Title>{hotel.name}</Card.Title>
          <Card.Text>{hotel.description}</Card.Text>
        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroup.Item>Amenties - {hotel.amenities}<ion-icon name="sparkles-outline" style={{color:'#1d58a2 ',position: 'relative',top: '2px',left: '5px'}}></ion-icon></ListGroup.Item>
          <ListGroup.Item>Rating - {hotel.rating}<ion-icon name="star-sharp" size='medium' style={{color:'#1d58a2',position: 'relative',top: '1px'}}></ion-icon> </ListGroup.Item>
          <ListGroup.Item>Price - {hotel.price}<ion-icon name="cash-sharp"style={{color:'#1d58a2 ',position: 'relative',top: '2px',left: '5px'}}></ion-icon></ListGroup.Item>
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
    );
  }
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
    <center style={{backgroundColor: 'whitesmoke'}}>
      <div className="Featured-container">
        <div className="scroll-buttons">
          <button onClick={scrollLeft} className="scroll-btn">{"<"}</button>
          <button onClick={scrollRight} className="scroll-btn">{">"}</button>
        </div>
        <h2 style={{ fontSize: "30px", padding: '20px' }}>Featured Hotels</h2>
        <div
          className="hotel-container"
          ref={scrollContainerRef}
        >
          {hotelCards}
        </div>
      </div>
    </center>
  );
}

export default FeaturedHotels;


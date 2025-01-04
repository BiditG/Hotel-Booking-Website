import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Explore.css';

function Explore({ cities = [] }) {
  const ExploreCards = [];

  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];

    // Wrap the card in a Link to enable routing
    ExploreCards.push(
      <Link
        to={`/city/${city.name}`} // Navigate to the city detail page using city name as a parameter
        key={i}
        className="cardcon"
        style={{ textDecoration: 'none' }} // Remove underline for links
      >
        <Card style={{ width: '18rem', border: '1px groove #007bff' }}>
          <Card.Img
            variant="top"
            src={city.image}
            style={{ width: '290px', height: '144px' }}
          />
          <Card.Body>
            <Card.Title>{city.name}</Card.Title>
            {/* Add Description */}
            <Card.Text className="card-description">{city.description}</Card.Text>
          </Card.Body>
        </Card>
      </Link>
    );
  }

  return (
    <>
      <center style={{ marginTop: '20px' }}>
        <br/>
        <h2 className="headingexplore">Explore UK</h2>
        <p className="explore-description">
          Discover some of the most beautiful and historic cities in the United Kingdom. Whether you're looking for rich culture, iconic landmarks, or scenic views, there's something for everyone in these cities.
        </p>
        <div className="cards">{ExploreCards}</div>
      </center>
    </>
  );
}

export default Explore;

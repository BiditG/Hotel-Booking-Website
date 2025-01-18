import React, { useEffect, useRef } from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Explore.css';

function Explore({ cities = [] }) {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        container.scrollBy({ left: 1, behavior: 'smooth' });

        // Reset scroll to start if reached the end
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }
    }, 20); // Adjust the speed of scrolling

    return () => clearInterval(scrollInterval);
  }, []);

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
        <div className="cards" ref={scrollContainerRef} style={{ overflowX: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {ExploreCards}
        </div>
      </center>
    </>
  );
}

export default Explore;

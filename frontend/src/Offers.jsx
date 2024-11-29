import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './Offers.css'

function Offers() {
  // Function to calculate discount based on days in advance
  const getDiscount = (daysInAdvance) => {
    if (daysInAdvance >= 80 && daysInAdvance <= 90) {
      return 30;
    } else if (daysInAdvance >= 60 && daysInAdvance <= 79) {
      return 20;
    } else if (daysInAdvance >= 45 && daysInAdvance <= 59) {
      return 10;
    } else {
      return 0; // No discount for under 45 days
    }
  };

  // Example of different booking days for each offer (this can be dynamic based on real data)
  const offers = [
    { title: "Offer 1", daysInAdvance: 85, price: 1000 },
    { title: "Offer 2", daysInAdvance: 70, price: 1200 },
    { title: "Offer 3", daysInAdvance: 40, price: 900 },
  ];

  return (
    <>
      {offers.map((offer, index) => {
        const discount = getDiscount(offer.daysInAdvance);
        const discountedPrice = offer.price - (offer.price * discount / 100);

        return (
          <Card style={{ width: '18rem', marginBottom: '20px' }} key={index}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
              <Card.Title>{offer.title}</Card.Title>
              <Card.Text>
                Book {offer.daysInAdvance} days in advance<br />
                Discount: {discount}%<br />
                Original Price: ${offer.price}<br />
                Price After Discount: ${discountedPrice.toFixed(2)}
              </Card.Text>
              <Button variant="primary">Book Now</Button>
            </Card.Body>
          </Card>
        );
      })}
    </>
  );
}

export default Offers;

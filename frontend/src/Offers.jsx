import React from "react";
import { Carousel, Button, Card, Container } from "react-bootstrap"; // Import Container
import "./Offers.css";

function Offers() {
  const getDiscount = (daysInAdvance) => {
    if (daysInAdvance >= 80 && daysInAdvance <= 90) {
      return 30;
    } else if (daysInAdvance >= 60 && daysInAdvance <= 79) {
      return 20;
    } else if (daysInAdvance >= 45 && daysInAdvance <= 59) {
      return 10;
    } else {
      return 0;
    }
  };

  const offers = [
    {
      title: "Offer 1",
      daysInAdvance: 85,
      price: 1000,
      backgroundImage: "url('/images/offer1.jpg')",
    },
    {
      title: "Offer 2",
      daysInAdvance: 70,
      price: 1200,
      backgroundImage: "url('/images/offer2.jpg')",
    },
    {
      title: "Offer 3",
      daysInAdvance: 40,
      price: 900,
      backgroundImage: "url('/images/offer3.jpg')",
    },
    {
      title: "Offer 4",
      daysInAdvance: 90,
      price: 1500,
      backgroundImage: "url('/images/offer4.jpg')",
    },
    {
      title: "Offer 5",
      daysInAdvance: 55,
      price: 1100,
      backgroundImage: "url('/images/offer5.jpg')",
    },
  ];

  return (
    <Container>
      <div className="offertitle">
      <h2>Travel ideas and discounts with World Hotels</h2>
      <p>Choose World Hotels for your next getaway. Enjoy our unforgettable experiences with this selection of packs, rates and special discounts.</p>
      </div>


    </Container>
  );
}

export default Offers;

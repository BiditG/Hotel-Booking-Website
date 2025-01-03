import React, { useState, useEffect } from "react";
import { Button, Card, Container, Navbar, Nav, Row, Col, Tab, Tabs } from "react-bootstrap";
import axios from "axios"; // Import axios for making requests
import "./Offers.css";
import { Link } from "react-router-dom";

function Offers() {
  const [offers, setOffers] = useState([]);
  const [key, setKey] = useState("0");

  // Fetch offers from the API when the component mounts
  useEffect(() => {
    axios.get("http://localhost:5000/api/offers")
      .then((response) => {
        setOffers(response.data); // Set the offers in the state
      })
      .catch((error) => {
        console.error("Error fetching offers:", error);
      });
  }, []); // Empty dependency array ensures the effect runs once when the component mounts

  return (
    <>
      {/* Navigation Bar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="#home">World Hotels</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" justify="true">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#offers">Offers</Nav.Link>
            <Nav.Link href="#contact">Contact</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Container>
        <div className="offertitle">
          <h2>Travel Ideas and Discounts with World Hotels</h2>
          <br />
          <p>Choose World Hotels for your next getaway. Enjoy our unforgettable experiences with this selection of packs, rates, and special discounts.</p>
        </div>

        {/* Tabs for Offers */}
        <Tabs activeKey={key} onSelect={(k) => setKey(k)} id="offer-tabs" fill variant="tabs" style={{backgroundColor: 'whitesmoke'}}>
          {offers.map((offer, index) => (
            <Tab eventKey={index.toString()} title={offer.title} key={offer.id} style={{backgroundColor: 'whitesmoke'}}>
              <Container className="mt-4">
                <Row>
                  <Col md={6}>
                    <Card>
                      <Card.Img
                        variant="top"
                        src={offer.background_image}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <Card.Body>
                        <Card.Title>{offer.title}</Card.Title>
                        <Card.Text>
                          Price: ${offer.price}
                          <br />
                          Discount: {offer.discount_percentage}%
                          <br />
                          Price after discount: ${offer.discounted_price}
                        </Card.Text>
                        <Button variant="primary">
                          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
                            Book Now
                          </Link>
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </Tab>
          ))}
        </Tabs>
      </Container>
    </>
  );
}

export default Offers;

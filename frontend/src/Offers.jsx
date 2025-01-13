import React, { useState, useEffect } from "react";
import { Button, Card, Container, Typography, Grid, Tab, Tabs, Box } from "@mui/material";
import axios from "axios"; // Import axios for making requests
import { Link } from "react-router-dom";

function Offers() {
  const [offers, setOffers] = useState([]);
  const [key, setKey] = useState("0");

  // Fetch offers from the API when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/offers")
      .then((response) => {
        setOffers(response.data); // Set the offers in the state
      })
      .catch((error) => {
        console.error("Error fetching offers:", error);
      });
  }, []); // Empty dependency array ensures the effect runs once when the component mounts

  return (
    <>
      {/* Offer Title Container */}
      <Container sx={{ mt: 5, mb: 5 }} style={{ marginTop: "120px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <Typography variant="h4" gutterBottom sx={{ marginRight: { xs: 0, md: "400px" } }}>
            Travel Ideas and Discounts with World Hotels
          </Typography>
          <Typography sx={{ mt: 2, fontSize: "1.1rem", color: "#555" }}>
            Choose World Hotels for your next getaway. Enjoy our unforgettable experiences with this selection of packs, rates, and special discounts.
          </Typography>
        </div>

        {/* Box wrapper for the Tabs */}
        <Box sx={{ width: "100%", overflowX: "auto", mb: 4 }}>
          <Tabs
            value={key}
            onChange={(event, newValue) => setKey(newValue)}
            indicatorColor="primary"
            textColor="primary"
            centered
            scrollButtons="auto" // Enable scroll buttons if needed
            variant="scrollable" // Enable scrolling when tabs overflow
            sx={{
              "& .MuiTabs-scroller": {
                overflowX: "auto", // Ensure the scroller is scrollable
              },
            }}
          >
            {offers.map((offer, index) => (
              <Tab key={offer.id} label={offer.title} value={index.toString()} />
            ))}
          </Tabs>
        </Box>

        <div style={{ backgroundColor: "whitesmoke", padding: "24px", borderRadius: "8px" }}>
          {offers.map((offer, index) => (
            <div role="tabpanel" hidden={key !== index.toString()} key={offer.id}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={4}>
                  <Card
                    sx={{
                      transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: 5,
                      },
                    }}
                  >
                    <img
                      src={offer.background_image}
                      alt={offer.title}
                      style={{
                        height: "200px",
                        width: "100%",
                        objectFit: "cover",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                      }}
                    />
                    <div style={{ padding: "16px" }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1.2rem", mb: 2 }}>
                        {offer.title}
                      </Typography>
                      <Typography sx={{ mb: 2, color: "#666" }}>
                        Price: ${offer.price}
                        <br />
                        Discount: {offer.discount_percentage}%
                        <br />
                        Price after discount: ${offer.discounted_price}
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#1d58a2",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#155a8a",
                          },
                        }}
                        component={Link}
                        to="/"
                        fullWidth
                      >
                        Book Now
                      </Button>
                    </div>
                  </Card>
                </Grid>
              </Grid>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}

export default Offers;

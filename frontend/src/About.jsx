import React from "react";
import { Container, Typography, Grid, Paper, Box, Avatar } from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import PublicIcon from "@mui/icons-material/Public";
import { motion } from "framer-motion";

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8, backgroundColor: "#fff", borderRadius: "15px", p: 5 }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography variant="h3" sx={{ fontWeight: "bold", color: "#222" }}>
            About <span style={{ color: "#1d58a2" }}>World Hotels</span>
          </Typography>
          <Typography variant="body1" sx={{ color: "#555", fontSize: "18px", mt: 2, lineHeight: "1.8" }}>
            Discover your perfect stay with World Hotels, the premier platform for finding top-rated accommodations worldwide. 
            Whether it’s a luxury retreat or a budget-friendly escape, we have options to suit every traveler.
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Paper elevation={3} sx={{ textAlign: "center", p: 4, borderRadius: "15px" }}>
                <Avatar sx={{ bgcolor: "#1d58a2", width: 60, height: 60, mb: 2, mx: "auto" }}>
                  <HotelIcon fontSize="large" style={{ color: "#fff" }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                  Trusted Accommodations
                </Typography>
                <Typography variant="body2" sx={{ color: "#555", mt: 1 }}>
                  Over 10,000+ verified hotels worldwide to ensure you have the best stay.
                </Typography>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Paper elevation={3} sx={{ textAlign: "center", p: 4, borderRadius: "15px" }}>
                <Avatar sx={{ bgcolor: "#43a047", width: 60, height: 60, mb: 2, mx: "auto" }}>
                  <PriceCheckIcon fontSize="large" style={{ color: "#fff" }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                  Affordable Pricing
                </Typography>
                <Typography variant="body2" sx={{ color: "#555", mt: 1 }}>
                  Get the best deals and discounts, making your dream vacations more affordable.
                </Typography>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Paper elevation={3} sx={{ textAlign: "center", p: 4, borderRadius: "15px" }}>
                <Avatar sx={{ bgcolor: "#1565c0", width: 60, height: 60, mb: 2, mx: "auto" }}>
                  <PublicIcon fontSize="large" style={{ color: "#fff" }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                  Global Reach
                </Typography>
                <Typography variant="body2" sx={{ color: "#555", mt: 1 }}>
                  Access properties in over 100+ countries, ensuring global travel options.
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#222" }}>
            Why Book with Us?
          </Typography>
          <Typography variant="body1" sx={{ color: "#555", mt: 2, fontSize: "16px", lineHeight: "1.8" }}>
            World Hotels offers an easy, secure, and efficient booking experience. With 24/7 customer support, verified accommodations, and unbeatable prices, we are your trusted travel partner.
          </Typography>
        </Box>
      </motion.div>
    </Container>
  );
};

export default About;

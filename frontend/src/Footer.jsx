import React from "react";
import { Box, Container, Grid, Typography, TextField, Button, IconButton, Divider } from "@mui/material";
import { Facebook, Instagram, Twitter, LinkedIn, YouTube } from "@mui/icons-material";

function Footer() {
  return (
    <>
    <br/>
    <br/>
    <Box
      sx={{
        backgroundColor: "#1d58a2",
        color: "#fff",
        pt: 5,
        pb: 3,
        mt: 5,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              About Us
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8 }} style={{color: '#fff'}}>
              World Hotels offers premium stays, curated experiences, and unmatched hospitality worldwide. 
              With thousands of properties across the globe, we aim to provide comfort and luxury for every traveler.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button href="#" variant="text" sx={{ color: "inherit", justifyContent: "flex-start" }}>
                Home
              </Button>
              <Button href="#" variant="text" sx={{ color: "inherit", justifyContent: "flex-start" }}>
                Destinations
              </Button>
              <Button href="#" variant="text" sx={{ color: "inherit", justifyContent: "flex-start" }}>
                Book a Room
              </Button>
              <Button href="#" variant="text" sx={{ color: "inherit", justifyContent: "flex-start" }}>
                Contact Us
              </Button>
              <Button href="#" variant="text" sx={{ color: "inherit", justifyContent: "flex-start" }}>
                FAQs
              </Button>
              <Button href="#" variant="text" sx={{ color: "inherit", justifyContent: "flex-start" }}>
                Careers
              </Button>
            </Box>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Newsletter
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.8 }} style={{color: '#fff'}}>
              Stay updated with our latest offers, travel tips, and exciting destinations. Subscribe to our newsletter now!
            </Typography>
            <TextField
              variant="outlined"
              placeholder="Enter your email"
              size="small"
              fullWidth
              sx={{ backgroundColor: "#fff", borderRadius: 1, mb: 1 }}
            />
            <Button variant="contained" color="secondary" fullWidth>
              Subscribe
            </Button>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Follow Us
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.8  }} style={{color: '#fff'}}>
              Connect with us on social media and share your travel experiences.
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <IconButton href="#" sx={{ color: "#fff" }}>
                <Facebook />
              </IconButton>
              <IconButton href="#" sx={{ color: "#fff" }}>
                <Instagram />
              </IconButton>
              <IconButton href="#" sx={{ color: "#fff" }}>
                <Twitter />
              </IconButton>
              <IconButton href="#" sx={{ color: "#fff" }}>
                <LinkedIn />
              </IconButton>
              <IconButton href="#" sx={{ color: "#fff" }}>
                <YouTube />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: "#ddd", my: 3 }} />

        {/* Legal Section */}
        <Box
          sx={{
            textAlign: "center",
            color: "#ccc",
            fontSize: "14px",
          }}
        >
          <Typography variant="body2" style={{color: '#fff'}}>
            © 2024 World Hotels. All rights reserved. <a href="#" style={{ color: "#fff", textDecoration: "none" }}>Privacy Policy</a> | <a href="#" style={{ color: "#fff", textDecoration: "none" }}>Terms of Use</a>
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }} style={{color: '#fff'}}>
            Designed with ❤️ by World Hotels.
          </Typography>
        </Box>
      </Container>
    </Box>
    </>
  );
}

export default Footer;

import React, { useEffect, useRef } from "react";
import { Container, Typography, Box, Avatar } from "@mui/material";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "John Doe",
    review: "World Hotels made my vacation planning so easy and stress-free. The variety of options and affordable prices are unbeatable!",
    avatar: "https://i.pravatar.cc/100?img=1",
  },
  {
    name: "Jane Smith",
    review: "I was amazed by the quality of the accommodations. Booking with World Hotels was seamless, and the support team was very helpful!",
    avatar: "https://i.pravatar.cc/100?img=2",
  },
  {
    name: "Michael Lee",
    review: "Highly recommend World Hotels! They offer the best deals and a wide range of choices for every budget.",
    avatar: "https://i.pravatar.cc/100?img=3",
  },
  {
    name: "Emily Davis",
    review: "Booking was super fast and easy. I found great deals for my family trip.",
    avatar: "https://i.pravatar.cc/100?img=4",
  },
  {
    name: "Chris Johnson",
    review: "The best platform for travel planning. Highly recommended!",
    avatar: "https://i.pravatar.cc/100?img=5",
  },
];

const Testimonials = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (containerRef.current) {
        containerRef.current.scrollBy({
          left: 1,
          behavior: "smooth",
        });
      }
    }, ); // Adjust the speed of scrolling

    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8, textAlign: "center" }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <br/>
        <br/>
        <Typography variant="h3" sx={{ fontWeight: "bold", color: "#222" }}>
          What Our Customers Say
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "#555", fontSize: "18px", mt: 2, mb: 5, lineHeight: "1.8" }}
        >
          Hear from our happy customers who have experienced the best with World Hotels.
        </Typography>

        <Box
          ref={containerRef}
          sx={{
            display: "flex",
            overflowX: "scroll",
            scrollBehavior: "smooth",
            gap: 3,
            "&::-webkit-scrollbar": { display: "none" },
            mt: 4,
          }}
        >
          {testimonials.concat(testimonials).map((testimonial, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ minWidth: "300px", flexShrink: 0 }}
            >
              <Box
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: "15px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#fff",
                }}
              >
                <Avatar
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#333" }}
                >
                  {testimonial.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#555", mt: 1, fontStyle: "italic" }}
                >
                  "{testimonial.review}"
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      </motion.div>
    </Container>
  );
};

export default Testimonials;

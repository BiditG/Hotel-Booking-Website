import React, { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Box, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "./Register.css"; // Import the scoped CSS file

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Initialize the navigate function

  // Helper function to validate if a string is a valid postal code (numeric and of length 5 or more)
  const validatePostalCode = (postalCode) => {
    return /^\d{5,}$/.test(postalCode); // Assuming postal code is a numeric string with at least 5 digits
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error

    // Validation checks
    if (!username || !email || !password || !address || !postalCode) {
      setError("All fields are required.");
      return;
    }

    if (!isNaN(username)) {
      setError("Username cannot be a number.");
      return;
    }

    if (!validatePostalCode(postalCode)) {
      setError("Invalid postal code. It must be numeric and at least 5 digits.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Check if email is already taken
    try {
      const emailCheckResponse = await axios.post("http://localhost:5000/check-email", { email });
      if (emailCheckResponse.data.exists) {
        setError("Email is already taken.");
        return;
      }
    } catch (err) {
      setError("Error checking email availability.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/register", {
        username,
        email,
        password,
        address,
        postalCode,
      });
      alert(res.data.message);
      // Redirect to login page after successful registration
      navigate("/login");
    } catch (err) {
      setError(err.response.data.message || "An error occurred during registration.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box sx={{ p: 3, border: "1px solid #ddd", borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Address"
            variant="outlined"
            fullWidth
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Postal Code"
            variant="outlined"
            fullWidth
            required
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Register;

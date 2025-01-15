import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, FormControlLabel, Checkbox, Container, Box, Typography, Paper } from '@mui/material';
import './Login.css';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:5000/login',
        { email, password, remember: rememberMe },
        { withCredentials: true }
      );

      if (response.data.message === 'Login successful') {
        // Check if the logged-in user is an admin
        if (response.data.user.email === 'admin@example.com') {
          // Redirect to the Admin Panel
          navigate('/adminpanel');
        } else {
          // Redirect to the profile page for regular users
          navigate('/profile');
        }
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (err) {
      alert('An error occurred during login.');
      console.error(err);
    }
  };

  return (
    <Container component="main" maxWidth="xs" style={{marginTop: '120px'}}>
      <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                color="primary"
              />
            }
            label="Remember me"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;

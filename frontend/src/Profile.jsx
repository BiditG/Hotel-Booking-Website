import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import './Profile.css'; // Import the scoped CSS file

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the logged-in user's data
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user', {
          withCredentials: true, // Include credentials for cross-origin requests
        });

        if (response.data) {
          setUser(response.data);
        }
      } catch (err) {
        console.error('Error fetching user profile', err);
        setError('Unable to fetch profile. Please log in again.');
        navigate('/login');
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordChangeError("Passwords don't match.");
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/change-password',
        { newPassword },
        { withCredentials: true }
      );

      if (response.data.message === 'Password updated successfully') {
        alert('Password updated successfully!');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordChangeError('');
      }
    } catch (err) {
      setPasswordChangeError('Failed to update password. Please try again.');
    }
  };

  // Function to log out the user
  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:5000/api/logout', { withCredentials: true });
      // Redirect to login page after successful logout
      navigate('/login');
    } catch (err) {
      console.error('Error logging out:', err);
      alert('Failed to log out. Please try again.');
    }
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="sm" style={{marginTop: '120px'}}>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>User Profile</Typography>

        <Typography variant="h6"><strong>Username:</strong> {user.username}</Typography>
        <Typography variant="body1"><strong>Email:</strong> {user.email}</Typography>

        {/* Password Change Form */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Change Password</Typography>
          <form onSubmit={handlePasswordChange}>
            <TextField
              label="New Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <TextField
              label="Confirm New Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {passwordChangeError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {passwordChangeError}
              </Alert>
            )}

            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              sx={{ mt: 3 }}
            >
              Change Password
            </Button>
          </form>
        </Box>

        {/* Logout Button */}
        <Box sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={handleLogout}
            sx={{ mt: 2 }}
            startIcon={<LockOutlined />}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;

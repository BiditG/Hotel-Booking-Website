import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>

      {/* Password Change Form */}
      <h3>Change Password</h3>
      <form onSubmit={handlePasswordChange}>
        <div>
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {passwordChangeError && <p style={{ color: 'red' }}>{passwordChangeError}</p>}
        <button type="submit">Change Password</button>
      </form>

      {/* Logout Button */}
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;

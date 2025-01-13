import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Usermanagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // Store the user being edited
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [loading, setLoading] = useState(false); // For loading state
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users', { withCredentials: true });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle user edit
  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUsername(user.username);
    setNewEmail(user.email);
    setNewPassword(''); // Reset password field
  };

  // Handle user details update
  const handleUpdateUser = async () => {
    setLoading(true);
    try {
      const updatedUser = {
        username: newUsername,
        email: newEmail,
        password: newPassword, // Include password if changed
      };
      await axios.put(`http://localhost:5000/api/admin/users/${editingUser.id}`, updatedUser, { withCredentials: true });
      fetchUsers();
      setEditingUser(null); // Close the modal
      setNewPassword('');
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, { withCredentials: true });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container style={{ marginTop: '50px' }}>
      <Typography variant="h3" align="center" color="primary" gutterBottom>
        👥 User Management 👥
      </Typography>

      {/* Search Input */}
      <TextField
        label="Search Users"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ mb: 4 }}
      />

      <Box mt={4}>
        {loading ? (
          <CircularProgress />
        ) : filteredUsers.length > 0 ? (
          <List>
            {filteredUsers.map((user) => (
              <ListItem key={user.id}>
                <ListItemText primary={user.username} secondary={user.email} />
                <IconButton onClick={() => handleEditUser(user)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteUser(user.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No users found</Typography>
        )}
      </Box>

      {/* Modal for Editing User */}
      <Dialog open={editingUser !== null} onClose={() => setEditingUser(null)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            fullWidth
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            fullWidth
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password (optional)"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingUser(null)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateUser} color="primary">
            Update User
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Usermanagement;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

const Adminuser = ({ fetchUsers, users, handleDeleteUser, handleUpdatePassword }) => {
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePasswordChange = (e) => setNewPassword(e.target.value);

  return (
    <Box>
      <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
        👥 Users Management 👥
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List sx={{ mb: 4 }}>
          {users.map((user) => (
            <ListItem
              key={user.id}
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <ListItemText primary={`${user.username}`} secondary={`Email: ${user.email}`} />
              <IconButton edge="end" color="primary" onClick={() => handleUpdatePassword(user.id)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" color="error" onClick={() => handleDeleteUser(user.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default Adminuser;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Container, Grid, TextField, Typography, Alert, List, ListItem, ListItemText, IconButton, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const AdminPanel = () => {
  const [hotels, setHotels] = useState([]);
  const [users, setUsers] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [newHotel, setNewHotel] = useState({
    name: '',
    description: '',
    image: '',
    amenities: '',
    rating: '',
    price: '',
    city: '',
    room_capacity: '',
    standard_rate_peak: '',
    standard_rate_off_peak: '',
    status: 'available',
  });
  const [newPassword, setNewPassword] = useState('');
  const [newRate, setNewRate] = useState('');
  const [editingHotel, setEditingHotel] = useState(null); 
  const [openModal, setOpenModal] = useState(false); 

  const fetchHotels = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/hotels', { withCredentials: true });
      setHotels(response.data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users', { withCredentials: true });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/currencies', { withCredentials: true });
      setCurrencies(response.data);
    } catch (error) {
      console.error('Error fetching currencies:', error);
    }
  };

  const handleChange = (e) => {
    setNewHotel({
      ...newHotel,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleRateChange = (e) => {
    setNewRate(e.target.value);
  };

  const handleAddHotel = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/hotels', newHotel, { withCredentials: true });
      fetchHotels(); 
      setNewHotel({
        name: '',
        description: '',
        image: '',
        amenities: '',
        rating: '',
        price: '',
        city: '',
        room_capacity: '',
        standard_rate_peak: '',
        standard_rate_off_peak: '',
        status: 'available',
      });
    } catch (error) {
      console.error('Error adding hotel:', error);
    }
  };

  const handleEditHotel = (hotel) => {
    setEditingHotel(hotel);
    setNewHotel({ ...hotel });
    setOpenModal(true);
  };

  const handleUpdateHotel = async () => {
    try {
      await axios.put(`http://localhost:5000/api/admin/hotels/${editingHotel.id}`, newHotel, { withCredentials: true });
      fetchHotels(); 
      setOpenModal(false); 
      setEditingHotel(null); 
    } catch (error) {
      console.error('Error updating hotel:', error);
    }
  };

  const handleDeleteHotel = async (hotelId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/hotels/${hotelId}`, { withCredentials: true });
      fetchHotels(); 
    } catch (error) {
      console.error('Error deleting hotel:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, { withCredentials: true });
      fetchUsers(); 
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleUpdatePassword = async (userId) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${userId}/password`, { password: newPassword }, { withCredentials: true });
      fetchUsers(); 
      setNewPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  const handleUpdateCurrency = async (currencyCode) => {
    try {
      await axios.put(`http://localhost:5000/api/currencies/${currencyCode}`, { rate: newRate }, { withCredentials: true });
      fetchCurrencies();
      setNewRate('');
    } catch (error) {
      console.error('Error updating currency rate:', error);
    }
  };

  useEffect(() => {
    fetchHotels();
    fetchUsers();
    fetchCurrencies();
  }, []);

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h3" align="center" color="primary" gutterBottom>
          🏨 Admin Panel 🛠️
        </Typography>

        <Tabs>
          <TabList>
            <Tab>Hotels</Tab>
            <Tab>Add Hotel</Tab>
            <Tab>Users</Tab>
            <Tab>Currency Exchange</Tab>
          </TabList>

          {/* Tab Panel for Hotels */}
          <TabPanel>
            <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
              🏨 Hotels List 🏨
            </Typography>
            <List sx={{ mb: 4 }}>
              {hotels.map((hotel) => (
                <ListItem key={hotel.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <ListItemText
                    primary={`${hotel.name} (${hotel.city})`}
                    secondary={`Rating: ${hotel.rating} ⭐ | Status: ${hotel.status}`}
                  />
                  <IconButton edge="end" color="primary" onClick={() => handleEditHotel(hotel)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" color="error" onClick={() => handleDeleteHotel(hotel.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </TabPanel>

          {/* Tab Panel for Add Hotel */}
          <TabPanel>
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h5" color="secondary" gutterBottom>
                  🌟 Add New Hotel 🌟
                </Typography>
                <form onSubmit={handleAddHotel}>
                  <Grid container spacing={2}>
                    {/* Hotel Details */}
                    {Object.keys(newHotel).map((key) => (
                      key !== 'status' && (
                        <Grid item xs={12} sm={6} key={key}>
                          <TextField
                            fullWidth
                            label={`Hotel ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                            name={key}
                            value={newHotel[key]}
                            onChange={handleChange}
                            required
                            variant="outlined"
                          />
                        </Grid>
                      )
                    ))}
                  </Grid>
                  <Button variant="contained" color="primary" type="submit" sx={{ mt: 3 }}>
                    Add Hotel
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabPanel>

          {/* Tab Panel for Users */}
          <TabPanel>
            <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
              👥 Users List 👥
            </Typography>
            <List sx={{ mb: 4 }}>
              {users.map((user) => (
                <ListItem key={user.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <ListItemText primary={user.username} secondary={user.email} />
                  <IconButton edge="end" color="primary" onClick={() => handleUpdatePassword(user.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" color="error" onClick={() => handleDeleteUser(user.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
            <TextField
              label="New Password"
              value={newPassword}
              onChange={handlePasswordChange}
              variant="outlined"
              type="password"
              fullWidth
              sx={{ mb: 2 }}
            />
          </TabPanel>

          {/* Tab Panel for Currency Exchange */}
          <TabPanel>
            <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
              💸 Currency Exchange Rates 💸
            </Typography>
            <List sx={{ mb: 4 }}>
              {currencies.map((currency) => (
                <ListItem key={currency.currency_code} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <ListItemText
                    primary={`${currency.currency_code}`}
                    secondary={`Rate: ${currency.rate}`}
                  />
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="New Rate"
                      value={newRate}
                      onChange={handleRateChange}
                      variant="outlined"
                      type="number"
                    />
                  </Grid>
                  <IconButton edge="end" color="primary" onClick={() => handleUpdateCurrency(currency.currency_code)}>
                    <EditIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </TabPanel>
        </Tabs>

        {/* Modal for Editing Hotel */}
        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <DialogTitle>📝 Edit Hotel</DialogTitle>
          <DialogContent>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateHotel(); }}>
              <Grid container spacing={2}>
                {Object.keys(newHotel).map((key) => (
                  key !== 'status' && (
                    <Grid item xs={12} sm={6} key={key}>
                      <TextField
                        fullWidth
                        label={`Hotel ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                        name={key}
                        value={newHotel[key]}
                        onChange={handleChange}
                        required
                        variant="outlined"
                      />
                    </Grid>
                  )
                ))}
              </Grid>
              <DialogActions>
                <Button onClick={() => setOpenModal(false)} color="secondary">Cancel</Button>
                <Button type="submit" color="primary">Update Hotel</Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </Box>
    </Container>
  );
};

export default AdminPanel;

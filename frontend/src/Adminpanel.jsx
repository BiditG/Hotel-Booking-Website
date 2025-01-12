import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Hotelmanagement from './Hotelmanagement';
import UserCurrencyManagement from './Usercurrencymanagement';
import TopPayingCustomers from './toppayingcustomers';
import DashboardAnalytics from './Dashboardanalytics';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Adminpanel = () => {
  const [hotels, setHotels] = useState([]);
  const [users, setUsers] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [topPayingCustomers, setTopPayingCustomers] = useState([]);
  const [topPaidHotels, setTopPaidHotels] = useState([]);
  const [salesChartData, setSalesChartData] = useState([]);
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
  const [loading, setLoading] = useState(false); // For loading state

  // Fetch data
  const fetchHotels = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin/hotels', { withCredentials: true });
      setHotels(response.data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const fetchCurrencies = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/currencies', { withCredentials: true });
      setCurrencies(response.data);
    } catch (error) {
      console.error('Error fetching currencies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
    fetchUsers();
    fetchCurrencies();
  }, []);

  // Handle form changes
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
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHotel = async (hotelId) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/admin/hotels/${hotelId}`, { withCredentials: true });
      fetchHotels();
    } catch (error) {
      console.error('Error deleting hotel:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleUpdatePassword = async (userId) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${userId}/password`, { password: newPassword }, { withCredentials: true });
      fetchUsers();
      setNewPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCurrency = async (currencyCode) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/currencies/${currencyCode}`, { rate: newRate }, { withCredentials: true });
      fetchCurrencies();
      setNewRate('');
    } catch (error) {
      console.error('Error updating currency rate:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditHotel = (hotel) => {
    setEditingHotel(hotel);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingHotel(null);
  };

  const handleUpdateHotel = async () => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/admin/hotels/${editingHotel.id}`, editingHotel, { withCredentials: true });
      fetchHotels();
      handleCloseModal();
    } catch (error) {
      console.error('Error updating hotel:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ marginTop: '50px' }}>
      <h2>ADMIN PANEL</h2>
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
            <Tab>Financial Analytics</Tab>
          </TabList>

          {/* Tab Panel for Hotels */}
          <TabPanel>
            <Hotelmanagement />
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
              👥 Users Management 👥
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <CircularProgress />
              </Box>
            ) : (
              <List sx={{ mb: 4 }}>
                {users.map((user) => (
                  <ListItem key={user.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <ListItemText
                      primary={`${user.username}`}
                      secondary={`Email: ${user.email}`}
                    />
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
          </TabPanel>

          {/* Tab Panel for Currency Exchange */}
          <TabPanel>
            <UserCurrencyManagement />
          </TabPanel>

          {/* Tab Panel for Sales Chart */}
          <TabPanel>
            <DashboardAnalytics />
          </TabPanel>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Adminpanel;

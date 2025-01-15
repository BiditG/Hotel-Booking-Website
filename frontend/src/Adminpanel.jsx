import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Card, Button, FormControl, InputLabel, Input, CircularProgress, Typography, Drawer, List, ListItem, ListItemText, IconButton, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu'; // Material UI menu icon
import CloseIcon from '@mui/icons-material/Close'; // Close Icon for the sidebar
import Hotelmanagement from './Hotelmanagement';
import UserCurrencyManagement from './Usercurrencymanagement';
import DashboardAnalytics from './Dashboardanalytics';
import Usermanagement from './Usermanagement';
import Updateoffer from './Updateoffer';

const Adminpanel = () => {
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
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);

  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setNewHotel({
      ...newHotel,
      [e.target.name]: e.target.value,
    });
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

  const handleExit = () => {
    navigate('/'); // Navigating to the home page (replace '/' with your desired path)
  };

  const drawerStyle = {
    width: 240,
    flexShrink: 0,
    zIndex: 1200,
  };

  const contentStyle = {
    padding: '16px',
  };

  return (
    <div>
      {/* Navbar */}
      <div style={{ backgroundColor: '#013b72', padding: '16px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" style={{ display: 'inline-block' }}>
          Admin Panel
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="primary"
            aria-label="open sidebar"
            onClick={() => setShowSidebar(!showSidebar)} // Toggle sidebar open/close
            style={{ color: 'white', display: 'block', marginRight: '16px' }}
          >
            <MenuIcon />
          </IconButton>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleExit}
            style={{
              color: 'white',
              backgroundColor: '#f44336',
              '&:hover': { backgroundColor: '#d32f2f' },
            }}
          >
            Exit Admin Panel
          </Button>
        </div>
      </div>

      <Container fluid>
        <Grid container spacing={2}>
          {/* Sidebar */}
          <Grid item xs={12} md={3} lg={2} className="p-0">
            <Drawer
              variant="persistent"
              anchor="left"
              open={showSidebar}
              onClose={() => setShowSidebar(false)}
              style={drawerStyle}
              sx={{
                '& .MuiDrawer-paper': {
                  width: 240,
                },
              }}
              BackdropProps={{
                onClick: () => setShowSidebar(false), // Close the drawer when clicking outside
              }}
            >
              <div style={{ padding: '10px', textAlign: 'right' }}>
                <IconButton
                  onClick={() => setShowSidebar(false)} // Close the sidebar
                  style={{ color: '#013b72' }}
                >
                  <CloseIcon />
                </IconButton>
              </div>
              <List>
                <ListItem button selected={selectedTab === 0} onClick={() => setSelectedTab(0)}>
                  <ListItemText primary="Hotels" />
                </ListItem>
                <Divider />
                <ListItem button selected={selectedTab === 1} onClick={() => setSelectedTab(1)}>
                  <ListItemText primary="Add Hotel" />
                </ListItem>
                <Divider />
                <ListItem button selected={selectedTab === 2} onClick={() => setSelectedTab(2)}>
                  <ListItemText primary="Users" />
                </ListItem>
                <Divider />
                <ListItem button selected={selectedTab === 3} onClick={() => setSelectedTab(3)}>
                  <ListItemText primary="Currency Exchange" />
                </ListItem>
                <Divider />
                <ListItem button selected={selectedTab === 4} onClick={() => setSelectedTab(4)}>
                  <ListItemText primary="Financial Analytics" />
                </ListItem>
                <Divider />
                <ListItem button selected={selectedTab === 5} onClick={() => setSelectedTab(5)}>
                  <ListItemText primary="Offer Management" />
                </ListItem>
              </List>
            </Drawer>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9} lg={10}>
            <div style={contentStyle}>
              {loading ? (
                <CircularProgress />
              ) : (
                <>
                  <Typography variant="h4" style={{ color: '#013b72', marginBottom: '16px' }} >
                    {selectedTab === 0 && 'Hotels'}
                    {selectedTab === 1 && 'Add New Hotel'}
                    {selectedTab === 2 && 'Users'}
                    {selectedTab === 3 && 'Currency Exchange'}
                    {selectedTab === 4 && 'Financial Analytics'}
                    {selectedTab === 5 && 'Offer Management'}
                  </Typography>

                  {selectedTab === 0 && <Hotelmanagement />}
                  {selectedTab === 1 && (
                    <Card style={{ padding: '16px' }}>
                      <Typography variant="h5" color="primary" gutterBottom>
                        🌟 Add New Hotel 🌟
                      </Typography>
                      <form onSubmit={handleAddHotel}>
                        <div>
                          {Object.keys(newHotel).map((key) => (
                            key !== 'status' && (
                              <div key={key} style={{ marginBottom: '16px' }}>
                                <InputLabel htmlFor={key} variant="outlined">
                                  {key.charAt(0).toUpperCase() + key.slice(1)}
                                </InputLabel>
                                <FormControl fullWidth>
                                  <Input
                                    type="text"
                                    name={key}
                                    value={newHotel[key]}
                                    onChange={handleChange}
                                    required
                                  />
                                </FormControl>
                              </div>
                            )
                          ))}
                        </div>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          style={{ marginTop: '16px' }}
                        >
                          Add Hotel
                        </Button>
                      </form>
                    </Card>
                  )}
                  {selectedTab === 2 && <Usermanagement />}
                  {selectedTab === 3 && <UserCurrencyManagement />}
                  {selectedTab === 4 && <DashboardAnalytics />}
                  {selectedTab === 5 && <Updateoffer />}
                </>
              )}
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Adminpanel;

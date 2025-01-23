
// Necessary imports 

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Card, Button, FormControl, InputLabel, Input, CircularProgress, Typography, Drawer, List, ListItem, ListItemText, IconButton, Divider, TextField  } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Hotelmanagement from './Hotelmanagement';
import UserCurrencyManagement from './Usercurrencymanagement';
import DashboardAnalytics from './Dashboardanalytics';
import Usermanagement from './Usermanagement';
import Updateoffer from './Updateoffer';
import RateAdmin from './Rateadmin';
import AIChatModal from './AI';

//Admin panel main function
const Adminpanel = () => {

  //Initializing states 
  const [hotels, setHotels] = useState([]);
  const [users, setUsers] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  //Empty variables for setting up a new hotel
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

  //Loading is false by default
  const [loading, setLoading] = useState(false);
  // Selected tab is 0 by default
  const [selectedTab, setSelectedTab] = useState(0);
  // Side bar is false by default
  const [showSidebar, setShowSidebar] = useState(false);
  // Initializing the navigate function
  const navigate = useNavigate();



  // Function to fetch hotels from the backend
  // Loading is true untill data is fetched
  const fetchHotels = async () => {
    setLoading(true);

    // Fetching details using axios
    try {
      const response = await axios.get('http://localhost:5000/api/admin/hotels', { withCredentials: true });

      //Updating the state of hotel once the data is rendered
      setHotels(response.data);

    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch users from the backend
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

  // Function to fetch currencies from the backend
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

  // Automatically calls the functions when the component renders
  useEffect(() => {
    fetchHotels();
    fetchUsers();
    fetchCurrencies();
  }, []);

  // e is the event
  // ...newHotel spreads the current state of the new hotel
  // key = value pair
  const handleChange = (e) => {
    setNewHotel({
      ...newHotel,
      [e.target.name]: e.target.value,
    });
  };

  // Function to add hotel
  const handleAddHotel = async (e) => {

    // Prevents the default behaviour of loading of browser which can disrupt flow in SPA like react 
    e.preventDefault();
    setLoading(true);

    // Post the details of new hotels to the existing hotels and reload the new hotels
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

  // Navigating to the home page on exit
  const handleExit = () => {
    navigate('/');
  };

  // Styles for drawer and content
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
            onClick={() => setShowSidebar(!showSidebar)}
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
                onClick: () => setShowSidebar(false),
              }}
            >
              <div style={{ padding: '10px', textAlign: 'right' }}>
                <IconButton
                  onClick={() => setShowSidebar(false)}
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
                <Divider />
                <ListItem button selected={selectedTab === 6} onClick={() => setSelectedTab(6)}>
                  <ListItemText primary="Ratings" />
                </ListItem>
                <Divider />
                <ListItem button selected={selectedTab === 7} onClick={() => setSelectedTab(7)}>
                  <ListItemText primary="AI analysis" />
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
                    {selectedTab === 6 && 'Ratings'}
                    {selectedTab === 7 && 'A.I analysis'}
                  </Typography>

                  {selectedTab === 0 && <Hotelmanagement />}
                  {selectedTab === 1 && (
                    <Card style={{ padding: '24px', maxWidth: '600px', margin: 'auto', marginTop: '32px', boxShadow: '0px 3px 6px rgba(0,0,0,0.1)' }}>
                      <Typography variant="h5" color="primary" gutterBottom style={{ textAlign: 'center' }}>
                        🌟 Add New Hotel 🌟
                      </Typography>

                      <form onSubmit={handleAddHotel}>
                        <Grid container spacing={3}>
                          {/* Iterate over the keys of the `newHotel` object */}
                          {Object.keys(newHotel).map(
                            (key) =>
                              key !== 'status' && (
                                <Grid item xs={12} sm={6} key={key}>
                                  <FormControl fullWidth>
                                    <TextField
                                      label={key.charAt(0).toUpperCase() + key.slice(1)} // Capitalize the first letter of the property name
                                      variant="outlined"
                                      name={key}
                                      value={newHotel[key]}
                                      onChange={handleChange}
                                      required
                                      type={key.toLowerCase().includes('email') ? 'email' : 'text'} // Example: Add field-specific input types
                                    />
                                  </FormControl>
                                </Grid>
                              )
                          )}
                        </Grid>

                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          fullWidth
                          style={{ marginTop: '24px', padding: '12px' }}
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
                  {selectedTab === 6 && <RateAdmin />}
                  {selectedTab === 7 && <AIChatModal />}
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

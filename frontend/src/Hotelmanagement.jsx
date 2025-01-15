import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  useMediaQuery,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const HotelManagement = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [updatedHotel, setUpdatedHotel] = useState({
    name: '',
    city: '',
    description: '',
    price: '',
    amenities: '',
    rating: '',
    status: '', // Added status field
  });
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query

  const isMobile = useMediaQuery('(max-width:600px)');
  
  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/admin/hotels', { withCredentials: true });
        setHotels(response.data || []);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const handleEditHotel = (hotel) => {
    setEditingHotel(hotel);
    setUpdatedHotel({
      name: hotel.name,
      city: hotel.city,
      description: hotel.description,
      price: hotel.price,
      amenities: hotel.amenities,
      rating: hotel.rating,
      status: hotel.status, // Fetch existing status
    });
    setOpenEditModal(true);
  };

  const handleUpdateHotel = async () => {
    if (!updatedHotel.status || !['available', 'packed'].includes(updatedHotel.status)) {
      alert('Invalid status value. Please select either "available" or "packed".');
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/api/admin/hotels/${editingHotel.id}`,
        updatedHotel,
        { withCredentials: true }
      );

      setHotels((prevHotels) =>
        prevHotels.map((hotel) =>
          hotel.id === editingHotel.id ? { ...hotel, ...updatedHotel } : hotel
        )
      );
      setOpenEditModal(false);
      setEditingHotel(null);
      setUpdatedHotel({
        name: '',
        city: '',
        description: '',
        price: '',
        amenities: '',
        rating: '',
        status: '',
      });
    } catch (error) {
      console.error('Error updating hotel:', error);
      alert('Error updating hotel. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenEditModal(false);
    setEditingHotel(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredHotels = hotels.filter((hotel) =>
    hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteHotel = async (hotelId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this hotel?');
    if (confirmDelete) {
      try {
        setLoading(true);
        const response = await axios.delete(`http://localhost:5000/api/admin/hotels/${hotelId}`, { withCredentials: true });
        if (response.status === 200) {
          setHotels(hotels.filter((hotel) => hotel.id !== hotelId));
          alert('Hotel deleted successfully!');
        } else {
          alert('Error deleting hotel.');
        }
      } catch (error) {
        alert('Failed to delete hotel. Please try again.');
        console.error('Error deleting hotel:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box sx={{ padding: isMobile ? 2 : 3 }}>
      <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
        🏨 Hotels List 🏨
      </Typography>

      <TextField
        label="Search Hotels"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
      />

      {loading ? (
        <CircularProgress />
      ) : filteredHotels.length > 0 ? (
        <List>
          {filteredHotels.map((hotel) => (
            <ListItem key={hotel.id} sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              <ListItemText
                primary={hotel.name}
                secondary={`City: ${hotel.city}`}
                sx={{ flex: 1 }}
              />
              <IconButton edge="end" color="primary" onClick={() => handleEditHotel(hotel)}>
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                color="error"
                onClick={() => handleDeleteHotel(hotel.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No hotels available</Typography>
      )}

      <Dialog open={openEditModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Edit Hotel</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Hotel Name"
            value={updatedHotel.name}
            onChange={(e) => setUpdatedHotel({ ...updatedHotel, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="City"
            value={updatedHotel.city}
            onChange={(e) => setUpdatedHotel({ ...updatedHotel, city: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={updatedHotel.description}
            onChange={(e) => setUpdatedHotel({ ...updatedHotel, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Price"
            value={updatedHotel.price}
            onChange={(e) => setUpdatedHotel({ ...updatedHotel, price: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Amenities"
            value={updatedHotel.amenities}
            onChange={(e) => setUpdatedHotel({ ...updatedHotel, amenities: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Rating"
            value={updatedHotel.rating}
            onChange={(e) => setUpdatedHotel({ ...updatedHotel, rating: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            label="Status"
            value={updatedHotel.status}
            onChange={(e) => setUpdatedHotel({ ...updatedHotel, status: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="packed">Packed</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateHotel} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HotelManagement;

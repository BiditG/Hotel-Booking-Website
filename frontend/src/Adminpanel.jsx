import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Adminpanel = () => {
  const [hotels, setHotels] = useState([]);
  const [users, setUsers] = useState([]);
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
    standard_rate_off_peak: ''
  });

  // Fetch hotels
  const fetchHotels = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/hotels', {
        withCredentials: true, // Include credentials (cookies)
      });
      if (Array.isArray(response.data)) {
        setHotels(response.data);
      } else {
        setHotels([]);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setHotels([]);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        withCredentials: true, // Include credentials (cookies)
      });
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  // Add new hotel
  const handleAddHotel = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/admin/hotels',
        newHotel,
        {
          withCredentials: true, // Include credentials (cookies)
        }
      );
      console.log(response.data);
      fetchHotels(); // Refresh the list of hotels after adding a new one
    } catch (error) {
      console.error('Error adding hotel:', error);
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    setNewHotel({
      ...newHotel,
      [e.target.name]: e.target.value
    });
  };

  // Delete a hotel
  const handleDeleteHotel = async (hotelId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/admin/hotels/${hotelId}`,
        { withCredentials: true } // Include credentials (cookies)
      );
      console.log(response.data);
      fetchHotels(); // Refresh the list of hotels
    } catch (error) {
      console.error('Error deleting hotel:', error);
    }
  };

  // Delete a user
  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/admin/users/${userId}`,
        { withCredentials: true } // Include credentials (cookies)
      );
      console.log(response.data);
      fetchUsers(); // Refresh the list of users
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Use useEffect to fetch hotels and users when the component mounts
  useEffect(() => {
    fetchHotels();
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Admin Panel</h1>

      <h2>Add New Hotel</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleAddHotel(); }}>
        <input
          type="text"
          name="name"
          value={newHotel.name}
          onChange={handleChange}
          placeholder="Hotel Name"
        />
        <input
          type="text"
          name="description"
          value={newHotel.description}
          onChange={handleChange}
          placeholder="Hotel Description"
        />
        <input
          type="text"
          name="image"
          value={newHotel.image}
          onChange={handleChange}
          placeholder="Hotel Image URL"
        />
        <input
          type="text"
          name="amenities"
          value={newHotel.amenities}
          onChange={handleChange}
          placeholder="Hotel Amenities"
        />
        <input
          type="number"
          name="rating"
          value={newHotel.rating}
          onChange={handleChange}
          placeholder="Hotel Rating"
        />
        <input
          type="number"
          name="price"
          value={newHotel.price}
          onChange={handleChange}
          placeholder="Hotel Price"
        />
        <input
          type="text"
          name="city"
          value={newHotel.city}
          onChange={handleChange}
          placeholder="Hotel City"
        />
        <input
          type="number"
          name="room_capacity"
          value={newHotel.room_capacity}
          onChange={handleChange}
          placeholder="Room Capacity"
        />
        <input
          type="number"
          name="standard_rate_peak"
          value={newHotel.standard_rate_peak}
          onChange={handleChange}
          placeholder="Standard Rate (Peak)"
        />
        <input
          type="number"
          name="standard_rate_off_peak"
          value={newHotel.standard_rate_off_peak}
          onChange={handleChange}
          placeholder="Standard Rate (Off Peak)"
        />
        <button type="submit">Add Hotel</button>
      </form>

      <h2>Hotels</h2>
      <ul>
        {hotels.map(hotel => (
          <li key={hotel.id}>
            {hotel.name} ({hotel.city}) - {hotel.rating} stars
            <button onClick={() => handleDeleteHotel(hotel.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username} ({user.email})
            <button onClick={() => handleDeleteUser(user.id)}>Delete User</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Adminpanel;

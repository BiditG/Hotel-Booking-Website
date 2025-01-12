import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, CircularProgress, Typography, IconButton, Grid, TextField, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; // Import EditIcon
import { Button } from '@mui/material'; // Add Button if needed

const UserCurrencyManagement = () => {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newRate, setNewRate] = useState(''); // State for storing new rate

  // Fetch currencies from API
  useEffect(() => {
    const fetchCurrencies = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/currencies', { withCredentials: true });
        console.log(response.data); // Log the response to check the data format
        setCurrencies(response.data || []);
      } catch (error) {
        console.error('Error fetching currencies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  // Handle rate input change
  const handleRateChange = (e) => {
    setNewRate(e.target.value); // Update the newRate value
  };

  // Handle update currency rate
  const handleUpdateCurrency = async (currencyCode) => {
    if (!newRate) {
      alert("Please enter a new rate");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/currencies/${currencyCode}`,
        { rate: newRate },
        { withCredentials: true }
      );
      alert('Currency rate updated successfully!');
      // Reset newRate after successful update
      setNewRate('');
      // Fetch the currencies again after updating
      const response = await axios.get('http://localhost:5000/api/currencies', { withCredentials: true });
      setCurrencies(response.data || []);
    } catch (error) {
      console.error('Error updating currency:', error);
      alert('Error updating currency rate');
    }
  };

  return (
    <div>
      <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
        💰 Currency Exchange 💰
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : currencies && currencies.length > 0 ? (
        <List>
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
      ) : (
        <Typography>No currencies available</Typography>
      )}
    </div>
  );
};

export default UserCurrencyManagement;

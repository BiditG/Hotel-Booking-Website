import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, CircularProgress, Typography, IconButton, Grid, TextField, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; // Import EditIcon
import { Button } from '@mui/material'; // Add Button if needed

const UserCurrencyManagement = () => {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newRates, setNewRates] = useState({}); // Object to store new rates for each currency

  // Fetch currencies from API
  useEffect(() => {
    const fetchCurrencies = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/currencies', { withCredentials: true });
        setCurrencies(response.data || []);
      } catch (error) {
        console.error('Error fetching currencies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  // Handle rate input change for a specific currency
  const handleRateChange = (currencyCode, value) => {
    setNewRates((prevRates) => ({
      ...prevRates,
      [currencyCode]: value, // Update the specific currency's rate
    }));
  };

  // Handle update currency rate
  const handleUpdateCurrency = async (currencyCode) => {
    const rate = newRates[currencyCode]; // Get the rate for the specific currency
    if (!rate) {
      alert('Please enter a new rate');
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/currencies/${currencyCode}`,
        { rate },
        { withCredentials: true }
      );
      alert('Currency rate updated successfully!');
      // Reset the rate for the updated currency
      setNewRates((prevRates) => ({
        ...prevRates,
        [currencyCode]: '',
      }));
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
                  value={newRates[currency.currency_code] || ''} // Use the rate for this currency
                  onChange={(e) => handleRateChange(currency.currency_code, e.target.value)} // Pass the currency code
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


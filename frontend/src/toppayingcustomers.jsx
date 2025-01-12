import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, CircularProgress, List, ListItem, ListItemText, Typography } from '@mui/material';

const TopPayingCustomers = () => {
  const [topPayingCustomers, setTopPayingCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Top Paying Customers
  useEffect(() => {
    const fetchTopPayingCustomers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/admin/top-paying-customers', { withCredentials: true });
        setTopPayingCustomers(response.data || []);
      } catch (error) {
        console.error('Error fetching top paying customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPayingCustomers();
  }, []);

  return (
    <Box>
      <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
        💵 Top Paying Customers 💵
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List sx={{ mb: 4 }}>
          {topPayingCustomers.length > 0 ? (
            topPayingCustomers.map((customer) => (
              <ListItem key={customer.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <ListItemText
                  primary={`${customer.name}`}
                  secondary={`Amount Spent: $${customer.amountSpent}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography>No top paying customers available</Typography>
          )}
        </List>
      )}
    </Box>
  );
};

export default TopPayingCustomers;

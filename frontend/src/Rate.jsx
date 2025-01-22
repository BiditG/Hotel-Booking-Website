import React, { useState } from 'react';
import { Modal, Box, Typography, Button, TextField, Rating } from '@mui/material';
import axios from 'axios';

const RatingModal = () => {
  const [open, setOpen] = useState(true);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      setMessage('Please provide a rating before submitting.');
      return;
    }

    try {
      await axios.post('http://127.0.0.1:5000/api/submit-rating', { rating, feedback });
      setMessage('Thank you for your feedback!');
      setTimeout(() => {
        setOpen(false);
      }, 2000); 
    } catch (error) {
      setMessage('Error submitting your feedback. Please try again.');
    }
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    textAlign: 'center',
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" gutterBottom>
          Rate Our Website
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          We value your feedback. Please rate your experience.
        </Typography>
        <Rating
          name="simple-controlled"
          value={rating}
          onChange={(event, newValue) => setRating(newValue)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Optional Feedback"
          multiline
          rows={3}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {message}
        </Typography>
      </Box>
    </Modal>
  );
};

export default RatingModal;

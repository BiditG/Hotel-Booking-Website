import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Modal,
  Box,
} from "@mui/material";
import { FaHotel, FaTrashAlt } from "react-icons/fa";
import "./Cart.css";
import RateModal from "./Rate"; 

function Cart() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [cancellationCharge, setCancellationCharge] = useState(0);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedCheckInDate, setSelectedCheckInDate] = useState(null);
  const [showRateModal, setShowRateModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch Cart Data
  const fetchCart = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/cart", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      } else {
        setError("Failed to fetch bookings.");
      }
    } catch (err) {
      setError("Error fetching bookings: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Available Currencies
  const fetchCurrencies = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/currencies");
      if (response.ok) {
        const data = await response.json();
        setCurrencies(data);
      } else {
        setError("Failed to fetch currencies.");
      }
    } catch (err) {
      setError("Error fetching currencies: " + err.message);
    }
  };
  const handleSubmitRating = async (rating, feedback) => {
    try {
      const response = await fetch("http://localhost:5000/api/submit-rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, feedback }),
      });

      if (response.ok) {
        alert("Thank you for your feedback!");
      } else {
        alert("Failed to submit rating. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchCurrencies();
  }, []);

  // Convert Price to Selected Currency
  const convertPrice = (price, currency) => {
    const currencyObj = currencies.find((c) => c.currency_code === currency);
    if (!currencyObj) return price; // Return original price if conversion is not possible
    return (price * parseFloat(currencyObj.rate)).toFixed(2);
  };

  // Calculate Cancellation Charges
  const calculateCancellationCharges = (checkInDate, totalPrice) => {
    const now = new Date();
    const checkIn = new Date(checkInDate);
    const daysBeforeCheckIn = (checkIn - now) / (1000 * 60 * 60 * 24); // days before check-in

    if (daysBeforeCheckIn > 60) {
      return 0; // No charges if cancelled more than 60 days before check-in
    } else if (daysBeforeCheckIn <= 60 && daysBeforeCheckIn > 30) {
      return (totalPrice * 0.5).toFixed(2); // 50% cancellation charges if cancelled between 30 and 60 days
    } else {
      return totalPrice.toFixed(2); // 100% cancellation charges if cancelled within 30 days
    }
  };

  // Handle Booking Cancellation
  const handleCancelBooking = (bookingId, checkInDate, totalPrice) => {
    const cancellationCharge = calculateCancellationCharges(checkInDate, totalPrice);
    setCancellationCharge(cancellationCharge);
    setSelectedBookingId(bookingId);
    setSelectedCheckInDate(checkInDate);
    setShowCancellationModal(true);
  };

  // Confirm Cancellation
  const confirmCancellation = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${selectedBookingId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (response.ok) {
        fetchCart();
        setShowCancellationModal(false);
        alert("Booking cancelled successfully!");
      } else {
        alert("Failed to cancel booking.");
      }
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };

  // Format Date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : `${date.toLocaleString("default", { month: "short" })} ${date.getDate()}, ${date.getFullYear()}`;
  };

  // Handle Currency Change
  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  // Handle Proceed to Payment
  const handleProceedToPayment = (booking) => {
    const convertedPrice = convertPrice(booking.totalPrice, selectedCurrency);
    navigate("/payment", {
      state: {
        hotel: booking.hotel,
        totalPrice: convertedPrice,
        bookingId: booking.id,
        selectedCurrency,
        currencies,
      },
    });
  };
  const handleDownloadReceipt = async (bookingId) => {
    try {
      // Make a GET request to the backend API to fetch the receipt PDF
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/receipt`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
      });
  
      if (!response.ok) {
        throw new Error("Failed to download receipt.");
      }
  
      // Convert the response into a Blob to handle the PDF file
      const blob = await response.blob();
  
      // Create a downloadable URL for the Blob
      const url = window.URL.createObjectURL(blob);
  
      // Create an anchor element and trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt_${bookingId}.pdf`;
      document.body.appendChild(link); // Append the link to the body
      link.click(); // Trigger the click to start the download
      document.body.removeChild(link); // Remove the link after downloading
    } catch (error) {
      console.error("Error downloading receipt:", error);
      alert("An error occurred while downloading the receipt. Please try again later.");
    }
  };

  if (currencies.length === 0) {
    return <CircularProgress />; // You can show a loading spinner until currencies are fetched
  }

  return (
    <Container className="cart-container">
      {/* Rating Modal */}
      <RateModal
        open={showRateModal}
        onClose={() => setShowRateModal(false)}
        onSubmit={handleSubmitRating}
      />
      <div className="text-center mb-4">
        <Typography variant="h4" gutterBottom>
          Your Cart 🛒
        </Typography>
        <Typography variant="body1">Review and manage your hotel bookings.</Typography>
      </div>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <FormControl variant="outlined" fullWidth style={{ margin: "10px" }}>
        <InputLabel>Currency</InputLabel>
        <Select value={selectedCurrency} onChange={handleCurrencyChange} label="Currency">
          <MenuItem value="">Select Currency</MenuItem> {/* Empty option as fallback */}
          {currencies.map((currency) => (
            <MenuItem key={currency.currency_code} value={currency.currency_code}>
              {currency.currency_code}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {bookings.length === 0 ? (
        <Typography variant="h6">No bookings found in your cart. 😢</Typography>
      ) : (
        <Grid container spacing={4}>
          {bookings.map((booking) => (
            <Grid item xs={12} sm={6} md={4} key={booking.id}>
              <Card elevation={3}>
                <CardMedia
                  component="img"
                  height="200"
                  image={booking.hotel?.image || "/default-image.jpg"}
                  alt={booking.hotel?.name || "Hotel Image"}
                />
                <CardContent>
                  <Typography variant="h6">
                    {booking.hotel?.name || "Hotel Name"} <FaHotel />
                  </Typography>
                  <Typography>
                    <strong>Status:</strong> {booking.status}
                  </Typography>
                  <Typography>
                    <strong>Check-in:</strong> {formatDate(booking.checkInDate)}
                  </Typography>
                  <Typography>
                    <strong>Check-out:</strong> {formatDate(booking.checkOutDate)}
                  </Typography>
                  <Typography>
                    <strong>Total Price:</strong> {convertPrice(booking.totalPrice, selectedCurrency)}{" "}
                    {selectedCurrency}
                  </Typography>
                </CardContent>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "16px" }}>
                  {booking.status === "Confirmed" ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleDownloadReceipt(booking.id)}
                    >
                      Download Receipt 🧾
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleProceedToPayment(booking)}
                    >
                      Proceed to Payment 💳
                    </Button>
                  )}
                  <IconButton
                    color="secondary"
                    onClick={() =>
                      handleCancelBooking(booking.id, booking.checkInDate, booking.totalPrice)
                    }
                  >
                    <FaTrashAlt />
                  </IconButton>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Cancellation Confirmation Modal */}
      <Modal open={showCancellationModal} onClose={() => setShowCancellationModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            padding: 4,
            borderRadius: 2,
            width: "80%",
            maxWidth: "400px",
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Confirm Cancellation
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 2 }}>
            Are you sure you want to cancel this booking? The cancellation charge will be{" "}
            {cancellationCharge} {selectedCurrency}.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={confirmCancellation}
            sx={{ marginRight: 2 }}
          >
            Confirm Cancellation
          </Button>
          <Button variant="outlined" onClick={() => setShowCancellationModal(false)}>
            Cancel
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}

export default Cart;

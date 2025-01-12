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
} from "@mui/material";
import { FaHotel, FaTrashAlt } from "react-icons/fa";
import "./Cart.css";

function Cart() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
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

  // Cancel a Booking
  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/bookings/${bookingId}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (response.ok) {
          fetchCart();
          alert("Booking cancelled successfully!");
        } else {
          alert("Failed to cancel booking.");
        }
      } catch (error) {
        console.error("Error canceling booking:", error);
      }
    }
  };

  // Proceed to Payment
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

  // Download Receipt
  const handleDownloadReceipt = (bookingId) => {
    // Assuming the server provides an endpoint to generate and download the receipt as a PDF or text file
    fetch(`http://localhost:5000/api/bookings/${bookingId}/receipt`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          // Create a download link dynamically
          response.blob().then((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `receipt_${bookingId}.pdf`; // Adjust the file name as needed
            a.click();
          });
        } else {
          alert("Failed to download receipt.");
        }
      })
      .catch((err) => {
        console.error("Error downloading receipt:", err);
      });
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

  // Render the Select dropdown only when currencies have been loaded
  if (currencies.length === 0) {
    return (
      <CircularProgress /> // You can show a loading spinner until currencies are fetched
    );
  }

  return (
    <Container className="cart-container">
      <div className="text-center mb-4">
        <Typography variant="h4" gutterBottom>
          Your Cart 🛒
        </Typography>
        <Typography variant="body1">Review and manage your hotel bookings.</Typography>
      </div>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <FormControl variant="outlined" fullWidth style={{margin: '10px'}}>
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
          {bookings.map((booking) => {
            console.log("Booking Status:", booking.status); // Debugging: Log booking status
            return (
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
                    <IconButton color="secondary" onClick={() => handleCancelBooking(booking.id)}>
                      <FaTrashAlt />
                    </IconButton>
                  </div>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}

export default Cart;


// Cart.js (Updated)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, CircularProgress, IconButton } from "@mui/material";
import { FaHotel, FaMoneyBillWave, FaCalendarAlt, FaTrashAlt } from "react-icons/fa";
import "./Cart.css";

function Cart() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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

    useEffect(() => {
        fetchCart();
    }, []);

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });

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

    const handleProceedToPayment = (booking) => {
        navigate("/payment", {
            state: {
                hotel: booking.hotel,
                totalPrice: booking.totalPrice,
                bookingId: booking.id,
            },
        });
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return isNaN(date.getTime())
            ? "Invalid Date"
            : `${date.toLocaleString("default", { month: "short" })} ${date.getDate()}, ${date.getFullYear()}`;
    };

    return (
        <Container className="cart-container">
            <div className="text-center mb-4">
                <Typography variant="h4" gutterBottom>Your Cart 🛒</Typography>
                <Typography variant="body1">Review and manage your hotel bookings.</Typography>
            </div>

            {loading && <CircularProgress />}
            {error && <Typography color="error">{error}</Typography>}

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
                                    <Typography><strong>Status:</strong> {booking.status}</Typography>
                                    <Typography><strong>Check-in:</strong> {formatDate(booking.checkInDate)}</Typography>
                                    <Typography><strong>Check-out:</strong> {formatDate(booking.checkOutDate)}</Typography>
                                    <Typography><strong>Total Price:</strong> ${parseFloat(booking.totalPrice).toFixed(2)}</Typography>
                                </CardContent>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleProceedToPayment(booking)}
                                    >
                                        Proceed to Payment 💳
                                    </Button>
                                    <IconButton color="secondary" onClick={() => handleCancelBooking(booking.id)}>
                                        <FaTrashAlt />
                                    </IconButton>
                                </div>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}

export default Cart;

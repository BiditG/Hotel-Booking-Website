import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { FaHotel, FaMoneyBillWave, FaCalendarAlt, FaTrashAlt } from "react-icons/fa"; // Add React Icons for better visuals
import "bootstrap/dist/css/bootstrap.min.css";
import "./Cart.css";

function Cart() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state) {
            setBookings([location.state]);
            setLoading(false);
        } else {
            const fetchBookings = async () => {
                try {
                    const response = await fetch("http://localhost:5000/api/bookings", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
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

            fetchBookings();
        }
    }, [location.state]);

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                if (response.ok) {
                    setBookings(bookings.filter((booking) => booking.id !== bookingId));
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
            {/* Title Section */}
            <div className="text-center mb-4">
                <h1>Your Cart 🛒</h1>
                <p>Review and manage your hotel bookings. You can proceed to payment or cancel bookings as needed. 🏨</p>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            )}

            {/* Error Handling */}
            {error && <p className="text-danger">{error}</p>}

            {/* If No Bookings */}
            {bookings.length === 0 ? (
                <div className="text-center">
                    <h4>No bookings found in your cart. 😢</h4>
                </div>
            ) : (
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                    {/* Booking List */}
                    {bookings.map((booking) => (
                        <Col key={booking.id}>
                            <Card className="cart-card">
                                {/* Card Image */}
                                <Card.Img
                                    variant="top"
                                    src={booking.hotel?.image || "/default-image.jpg"}
                                    alt={booking.hotel?.name || "Hotel Image"}
                                    className="cart-card-img"
                                />
                                <Card.Body>
                                    <Card.Title className="cart-card-title">
                                        <span>{booking.hotel?.name || "Hotel Name"}</span>
                                        <FaHotel className="cart-card-icon" />
                                    </Card.Title>

                                    <Card.Text>
                                        <strong>Room Type:</strong> {booking.roomType || "Not specified"}
                                        <br />
                                        <strong>
                                            <FaCalendarAlt className="me-2" />
                                            Check-in:
                                        </strong>{" "}
                                        {formatDate(booking.checkInDate) || "Not specified"}
                                        <br />
                                        <strong>
                                            <FaCalendarAlt className="me-2" />
                                            Check-out:
                                        </strong>{" "}
                                        {formatDate(booking.checkOutDate) || "Not specified"}
                                        <br />
                                        <strong>
                                            <FaMoneyBillWave className="me-2" />
                                            Total Price:
                                        </strong>{" "}
                                        ${parseFloat(booking.totalPrice || "0").toFixed(2)}
                                    </Card.Text>

                                    {/* Actions */}
                                    <div className="d-flex justify-content-between">
                                        <Button
                                            variant="primary"
                                            onClick={() => handleProceedToPayment(booking)}
                                            className="cart-btn"
                                        >
                                            Proceed to Payment 💳
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleCancelBooking(booking.id)}
                                            className="cart-btn"
                                        >
                                            <FaTrashAlt className="me-2" />
                                            Cancel Booking
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}

export default Cart;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Book.css";

function Book() {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/bookings/user", {
                    method: "GET",
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    setBookings(data);
                } else {
                    alert("Failed to fetch bookings.");
                }
            } catch (error) {
                console.error("Error fetching bookings:", error);
                alert("Error fetching bookings.");
            }
        };

        fetchBookings();
    }, []);

    const handleViewBooking = (booking) => {
        navigate(`/booking-details/${booking.id}`, { state: { booking } });
    };

    return (
        <div className="book-container">
            <h2>Your Bookings</h2>
            {bookings.length > 0 ? (
                <ul className="booking-list">
                    {bookings.map((booking) => (
                        <li key={booking.id} className="booking-item">
                            <p><strong>Hotel Name:</strong> {booking.hotelName}</p>
                            <p><strong>Check-in:</strong> {booking.checkInDate}</p>
                            <p><strong>Check-out:</strong> {booking.checkOutDate}</p>
                            <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
                            <button onClick={() => handleViewBooking(booking)}>View Details</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No bookings found.</p>
            )}
        </div>
    );
}

export default Book;

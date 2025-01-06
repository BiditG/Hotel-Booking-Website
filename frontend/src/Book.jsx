import React, { useEffect, useState } from 'react';
import './Book.css'; // Make sure to import the CSS

function Book() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            const response = await fetch("http://localhost:5000/api/bookings/user", {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                setBookings(data.bookings || []);
            } else {
                alert("Error fetching bookings");
            }
        };

        fetchBookings();
    }, []);

    return (
        <div className="book-container" style={{marginTop: '80px'}}>
            <h2 className="book-title">Your Bookings</h2>
            {bookings.length === 0 ? (
                <p className="no-bookings">No bookings available</p>
            ) : (
                <ul className="booking-list">
                    {bookings.map((booking) => (
                        <li key={booking.booking_id} className="booking-item">
                            <p className="hotel-name">Hotel: {booking.hotel_name}</p>
                            <p className="booking-date">Booking Date: {booking.booking_date}</p>
                            <p className="booking-status">Status: {booking.status}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Book;

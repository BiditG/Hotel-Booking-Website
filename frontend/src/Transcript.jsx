import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Transcript.css";

function Transcript() {
    const [booking, setBooking] = useState({});
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingId } = location.state || {};  // Extracting bookingId from state

    // Remove 'BOOK-' prefix if exists
    const cleanedBookingId = bookingId ? bookingId.replace('BOOK-', '') : null;

    useEffect(() => {
        const fetchBookingDetails = async () => {
            if (!cleanedBookingId) return;

            try {
                const response = await fetch(`http://localhost:5000/api/bookings/${cleanedBookingId}`, {
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setBooking(data);
                } else {
                    alert("Error fetching booking details.");
                }
            } catch (error) {
                console.error("Error fetching booking:", error);
            }
        };

        if (cleanedBookingId) {
            fetchBookingDetails();
        }
    }, [cleanedBookingId]);

    const handleCancelBooking = async () => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            try {
                const response = await fetch(`http://localhost:5000/api/bookings/cancel/${cleanedBookingId}`, {
                    method: "POST",
                    credentials: "include",
                });
                const result = await response.json();
                alert(result.message);
                if (response.ok) {
                    navigate("/bookings");
                }
            } catch (error) {
                console.error("Error cancelling booking:", error);
            }
        }
    };

    return (
        <div className="transcript-container" style={{ marginTop: '100px' }}>
            <h2>Booking Receipt</h2>
            {booking.hotel_name ? (
                <>
                    <p><strong>Hotel:</strong> {booking.hotel_name}</p>
                    <p><strong>Check-in Date:</strong> {booking.checkInDate}</p>
                    <p><strong>Check-out Date:</strong> {booking.checkOutDate}</p>
                    <p><strong>Total Price:</strong> {booking.totalPrice} USD</p>
                    <p><strong>Status:</strong> {booking.status}</p>
                    {booking.cancellation_charge && (
                        <p><strong>Cancellation Charge:</strong> {booking.cancellation_charge}%</p>
                    )}
                    <button className="cancel-booking-button" onClick={handleCancelBooking}>
                        Cancel Booking
                    </button>
                </>
            ) : (
                <p>Loading booking details...</p>
            )}
        </div>
    );
}

export default Transcript;

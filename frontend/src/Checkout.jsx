import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Checkout.css";

function Checkout() {
  const location = useLocation();
  const { hotel, roomType, numGuests, totalPrice, discount, bookingId, cancellationCharges } = location.state || {};
  const navigate = useNavigate();

  // If any values are undefined, set defaults
  const totalPriceFormatted = totalPrice ? totalPrice.toFixed(2) : "0.00";
  const cancellationChargesFormatted = cancellationCharges ? cancellationCharges.toFixed(2) : "0.00";

  // Handle confirmation of the booking
  const handleConfirmBooking = async () => {

    const userResponse = await fetch("http://localhost:5000/api/user", {
      method: "GET",
      credentials: "include",
    });

    if (userResponse.ok) {
      const currentUser = await userResponse.json();
      const bookingData = {
        hotelId: hotel.id,
        bookingDate: new Date().toISOString().split("T")[0],
        status: "Confirmed",
      };

      try {
        const response = await fetch("http://localhost:5000/api/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
          credentials: "include",
        });

        if (response.ok) {
          alert("Your booking has been confirmed!");
          navigate("/bookings");
        } else {
          const errorData = await response.json();
          alert(errorData.message || "Error confirming booking.");
        }
      } catch (error) {
        console.error("Error confirming booking:", error);
        alert("Error confirming booking.");
      }
    } else {
      alert("Please log in to confirm your booking.");
      navigate("/login");
    }
  };



  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Booking Confirmation</h2>
      <div className="checkout-details">
        <h3 className="hotel-name">{hotel ? hotel.name : "Hotel Name"}</h3>
        <p className="hotel-description">{hotel ? hotel.description : "Hotel Description"}</p>
        <img src={hotel ? hotel.image : ""} alt={hotel ? hotel.name : "Hotel Name"} className="checkout-image" />

        <div className="booking-summary">
          <h4>Booking Summary</h4>
          <p><strong>Booking ID:</strong> {bookingId || "N/A"}</p>
          <p><strong>Room Type:</strong> {roomType || "Standard Room"}</p>
          <p><strong>Number of Guests:</strong> {numGuests || 1}</p>
          <p><strong>Total Price:</strong> {totalPriceFormatted} USD</p>
          <p><strong>Discount Applied:</strong> {discount || 0}%</p>
          <p><strong>Cancellation Charges:</strong> {cancellationChargesFormatted} USD</p>
        </div>

        <button className="confirm-booking-button" onClick={handleConfirmBooking}>Confirm Booking</button>
      </div>
    </div>
  );
}

export default Checkout;

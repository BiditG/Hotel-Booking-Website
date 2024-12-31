import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Checkout.css";

function Checkout() {
  const location = useLocation();
  const { hotel, roomType, numGuests, totalPrice, discount, bookingId, cancellationCharges } = location.state || {};

  // If any values are undefined, set defaults
  const totalPriceFormatted = totalPrice ? totalPrice.toFixed(2) : "0.00";
  const cancellationChargesFormatted = cancellationCharges ? cancellationCharges.toFixed(2) : "0.00";

  const navigate = useNavigate();

  // Handle confirmation of the booking
  const handleConfirmBooking = () => {
    alert("Your booking has been confirmed!");
    // You can add logic here to save the booking to a database or perform other actions.
    navigate("/"); // Navigate to the home page or any other page after confirmation.
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

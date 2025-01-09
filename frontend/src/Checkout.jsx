import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Checkout.css";

function Checkout() {
    const location = useLocation();
    const {
        hotel, roomType, numGuests, totalPrice, discount, bookingId,
        cancellationCharges, checkInDate, checkOutDate
    } = location.state || {};
    const navigate = useNavigate();

    const formattedAmenities = Array.isArray(hotel?.amenities) && hotel.amenities.length > 0
        ? hotel.amenities.join(", ")
        : typeof hotel?.amenities === "string" && hotel.amenities.trim() !== ""
            ? hotel.amenities.split(",").map(item => item.trim()).join(", ")
            : "No amenities available";

    const totalPriceFormatted = Number(totalPrice || 0).toFixed(2);

    const cancellationChargesFormatted = cancellationCharges ? cancellationCharges.toFixed(2) : "0.00";
    const formattedCheckInDate = checkInDate || "Not specified";
    const formattedCheckOutDate = checkOutDate || "Not specified";

    const handleProceedToPayment = async () => {
        // Send the booking details to the backend
        try {
            const response = await fetch("http://localhost:5000/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    hotel_id: hotel.id,
                    room_type: roomType,
                    num_guests: numGuests,
                    total_price: totalPrice,
                    discount,
                    cancellation_charges: cancellationCharges,
                    check_in_date: checkInDate,
                    check_out_date: checkOutDate,
                }),
                credentials: "include",
            });

            if (response.ok) {
                console.log("Booking added successfully!");
                // Proceed to payment or show success message
                navigate("/cart", {
                    state: {
                        hotel,
                        totalPrice: totalPrice,
                        bookingId,
                        roomType,
                        checkInDate,
                        checkOutDate,
                        amenities: formattedAmenities,
                        numGuests,
                    },
                });
            } else {
                console.log("Failed to add booking.");
            }
        } catch (error) {
            console.error("Error saving booking:", error);
        }
    };

    return (
        <div className="checkout-container">
            <h2 className="checkout-title">Booking Confirmation</h2>
            <div className="checkout-details">
                <h3 className="hotel-name">{hotel?.name || "Hotel Name"}</h3>
                <p className="hotel-description">{hotel?.description || "Hotel Description"}</p>
                {hotel?.image && <img src={hotel.image} alt={hotel.name} className="checkout-image" />}

                <div className="booking-summary">
                    <h4>Booking Summary</h4>
                    <p><strong>Booking ID:</strong> {bookingId || "N/A"}</p>
                    <p><strong>Room Type:</strong> {roomType || "Standard Room"}</p>
                    <p><strong>Number of Guests:</strong> {numGuests || "N/A"}</p>
                    <p><strong>Total Price:</strong> {totalPriceFormatted} USD</p>
                    <p><strong>Discount Applied:</strong> {discount || "0"}%</p>
                    <p><strong>Cancellation Charges:</strong> {cancellationChargesFormatted} USD</p>
                    <p><strong>Check-in Date:</strong> {formattedCheckInDate}</p>
                    <p><strong>Check-out Date:</strong> {formattedCheckOutDate}</p>
                    <p><strong>Amenities:</strong> {formattedAmenities}</p>
                </div>

                <button
                    className="confirm-booking-button"
                    onClick={handleProceedToPayment}
                >
                    Add to cart
                </button>
            </div>
        </div>
    );
}

export default Checkout;

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Booking.css";
import RollingGallery from "./RollingGallery";
import Masonry from "./Masonry";

function Booking() {
  const location = useLocation();
  const hotel = location.state;
  const navigate = useNavigate(); // For navigation after booking
  const [roomType, setRoomType] = useState("Standard");
  const [numGuests, setNumGuests] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [cancellationCharges, setCancellationCharges] = useState(0);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  // Get current date and check-in date from hotel object
  const currentDate = new Date();
  const checkInDate = new Date(hotel.checkInDate); // Assuming hotel has a checkInDate field

  // Calculate the number of days in advance the booking is made
  const timeDifference = checkInDate - currentDate;
  const daysInAdvance = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Convert to days

  // Handle advanced booking discount
  useEffect(() => {
    let discountPercentage = 0;
    if (daysInAdvance >= 80) {
      discountPercentage = 30;
    } else if (daysInAdvance >= 60) {
      discountPercentage = 20;
    } else if (daysInAdvance >= 45) {
      discountPercentage = 10;
    }
    setDiscount(discountPercentage);
  }, [daysInAdvance]);

  // Handle room pricing
  useEffect(() => {
    let basePrice = hotel.price; // Assuming hotel price is for Standard room
    let roomPrice = basePrice;

    if (roomType === "Double") {
      roomPrice = basePrice * 1.2; // Double room is 20% more
      if (numGuests > 1) {
        roomPrice += basePrice * 0.1; // Extra 10% for second guest
      }
    } else if (roomType === "Family") {
      roomPrice = basePrice * 1.5; // Family room is 50% more
      if (numGuests > 2) {
        roomPrice += basePrice * 0.1 * (numGuests - 2); // Extra charge for more than 2 guests
      }
    }

    // Apply discount
    roomPrice -= roomPrice * (discount / 100);
    setTotalPrice(roomPrice);
  }, [roomType, numGuests, discount, hotel.price]);

  // Handle cancellation charges
  useEffect(() => {
    let charge = 0;
    if (daysInAdvance < 30) {
      charge = totalPrice; // 100% charge if within 30 days
    } else if (daysInAdvance < 60) {
      charge = totalPrice * 0.5; // 50% charge if between 30 and 60 days
    }
    setCancellationCharges(charge);
  }, [daysInAdvance, totalPrice]);

  // Handle room change
  const handleRoomChange = (event) => {
    setRoomType(event.target.value);
    if (event.target.value === "Standard") {
      setNumGuests(1);
    }
  };

  // Handle number of guests change
  const handleGuestChange = (event) => {
    setNumGuests(event.target.value);
  };

  // Handle booking
  const handleBookNow = () => {
    const newBookingId = `BOOK-${Math.floor(Math.random() * 1000000)}`; // Generate a unique booking ID
    setBookingId(newBookingId);
    setBookingSuccess(true);
    setTimeout(() => {
      navigate("/Checkout", { state: { hotel, roomType, numGuests, totalPrice, discount, bookingId: newBookingId } });
    }, 2000); // Redirect after 2 seconds to simulate a successful booking message
  };
  const data = [
    { id: 1, image: '/images/Aberdeen.jpg', height: 400 },
    { id: 2, image: '/images/Belfast.jpg', height: 300 },
    { id: 3, image: '/images/Birmingham.jpg', height: 300 },
    { id: 4, image: '/images/Bristol.jpg', height: 300 },
    { id: 5, image: '/images/Cardiff.jpg', height: 300 },
    { id: 6, image: '/images/Edinburgh.jpg', height: 300 },
    { id: 7, image: '/images/Glasgow.jpg', height: 200 },
    { id: 8, image: '/images/London.jpg', height: 300 },
    { id: 9, image: '/images/Manchester.jpg', height: 200 },
    { id: 10, image: '/images/Newcastle.jpg', height: 400 },
    { id: 11, image: '/images/Norwich.jpg', height: 350 },
    { id: 12, image: '/images/Nottingham.jpg', height: 250 },
    { id: 13, image: '/images/Oxford.jpg', height: 300 },
    { id: 14, image: '/images/Plymouth.jpg', height: 300 },
    { id: 15, image: '/images/Swansea.jpg', height: 250 },
    { id: 16, image: '/images/Bournemouth.jpg', height: 350 },
    { id: 17, image: '/images/Kent.jpg', height: 300 }
  ];

  return (
    <div className="booking-container">
      <h2 className="hotel-title">{hotel.name}</h2>
      <p className="hotel-description">{hotel.description}</p>
      <Masonry data={data}/>
      
      <img src={hotel.image} alt={hotel.name} className="hotel-image" />

      {bookingSuccess && (
        <div className="booking-success">
          <h3>Your booking was successful!</h3>
          <p>Booking ID: {bookingId}</p>
        </div>
      )}

      <div className="hotel-details">
        <h3>Amenities:</h3>
        <p>{Array.isArray(hotel.amenities) ? hotel.amenities.join(", ") : hotel.amenities || "No amenities available"}</p>

        <h3>Rating:</h3>
        <p>{hotel.rating}</p>

        <h3>Price:</h3>
        <p>Base Price: {hotel.price} USD</p>

        <h3>Room Type:</h3>
        <select value={roomType} onChange={handleRoomChange} className="room-select">
          <option value="Standard">Standard Room</option>
          <option value="Double">Double Room</option>
          <option value="Family">Family Room</option>
        </select>

        <h3>Number of Guests:</h3>
        <input type="number" value={numGuests} onChange={handleGuestChange} min="1" max={roomType === "Standard" ? 1 : roomType === "Double" ? 2 : 4} className="guest-input" />

        <h3>Total Price:</h3>
        <p>{totalPrice.toFixed(2)} USD</p>

        <h3>Discount:</h3>
        <p>{discount}% (Applied {daysInAdvance} days in advance)</p>

        <h3>Cancellation Charges (if applicable):</h3>
        <p>{cancellationCharges.toFixed(2)} USD</p>
      </div>

      <button className="book-now-button" onClick={handleBookNow}>Book Now</button>
    </div>
  );
}

export default Booking;

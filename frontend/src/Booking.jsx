import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Card, CardContent } from "@mui/material";
import Masonry from "./Masonry";
import "./Booking.css";

function Booking() {
  const location = useLocation();
  const hotel = location.state;
  const navigate = useNavigate();
  const [roomType, setRoomType] = useState("Standard");
  const [numGuests, setNumGuests] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [cancellationCharges, setCancellationCharges] = useState(0);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [isLongStay, setIsLongStay] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("USD"); // Currency state
  const [exchangeRates, setExchangeRates] = useState({}); // Exchange rates state

  // Peak season months (June, July, August, and December)
  const peakSeasonMonths = [6, 7, 8, 12];

  const currentDate = new Date();
  const daysInAdvance = (new Date(checkInDate) - currentDate) / (1000 * 60 * 60 * 24);

  // Fetch exchange rates from API
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/currencies");
        if (!response.ok) {
          throw new Error("Failed to fetch exchange rates.");
        }
        const data = await response.json();
        const rates = data.reduce((acc, { currency_code, rate }) => {
          acc[currency_code] = parseFloat(rate);
          return acc;
        }, {});
        setExchangeRates(rates); // Store the fetched exchange rates
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    fetchExchangeRates();
  }, []);

  // Convert price to selected currency
  const convertPrice = (price) => {
    if (!exchangeRates[selectedCurrency]) return price; // Return original price if conversion rate is not available
    return (price * exchangeRates[selectedCurrency]).toFixed(2);
  };

  // Logic to determine if the selected check-in date is in the peak or off-peak season
  const checkSeason = (date) => {
    const checkIn = new Date(date);
    const month = checkIn.getMonth() + 1; // Months are 0-indexed, so adding 1
    return peakSeasonMonths.includes(month) ? "peak" : "off-peak";
  };

  useEffect(() => {
    let basePrice = hotel.price;
    let roomPrice = basePrice;

    // Determine if the selected date is in peak or off-peak season
    const season = checkSeason(checkInDate);
    let priceToUse = season === "peak" ? hotel.standard_rate_peak : hotel.standard_rate_off_peak;

    // Apply the appropriate rate
    roomPrice = priceToUse;

    // Adjust for room type and number of guests
    if (roomType === "Double") {
      roomPrice = roomPrice * 1.2;
      if (numGuests > 1) {
        roomPrice += roomPrice * 0.1;
      }
    } else if (roomType === "Family") {
      roomPrice = roomPrice * 1.5;
      if (numGuests > 2) {
        roomPrice += roomPrice * 0.1 * (numGuests - 2);
      }
    }

    // Apply discount
    roomPrice -= roomPrice * (discount / 100);

    setTotalPrice(roomPrice);
  }, [roomType, numGuests, discount, hotel.price, checkInDate, hotel.standard_rate_peak, hotel.standard_rate_off_peak]);

  useEffect(() => {
    let charge = 0;
    const daysUntilCheckIn = (new Date(checkInDate) - currentDate) / (1000 * 60 * 60 * 24);
    if (daysUntilCheckIn < 30) {
      charge = totalPrice;
    } else if (daysUntilCheckIn < 60) {
      charge = totalPrice * 0.5;
    }
    setCancellationCharges(charge);
  }, [checkInDate, totalPrice]);

  const handleRoomChange = (event) => {
    setRoomType(event.target.value);
    if (event.target.value === "Standard") {
      setNumGuests(1);
    }
  };

  const handleGuestChange = (event) => {
    setNumGuests(event.target.value);
  };

  const handleCheckInChange = (event) => {
    setCheckInDate(event.target.value);
  };

  const handleCheckOutChange = (event) => {
    setCheckOutDate(event.target.value);
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(event.target.value);
    const stayDuration = (checkOut - checkIn) / (1000 * 60 * 60 * 24);
    if (stayDuration > 30) {
      setIsLongStay(true);
    } else {
      setIsLongStay(false);
    }
  };

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  const handleBookNow = () => {
    const newBookingId = Math.floor(Math.random() * 1000000);
    setBookingId(newBookingId);
    setBookingSuccess(true);
    setTimeout(() => {
      navigate("/Checkout", {
        state: {
          hotel,
          roomType,
          numGuests,
          totalPrice,
          discount,
          bookingId: newBookingId,
          checkInDate,
          checkOutDate,
          cancellationCharges,
          amenities: Array.isArray(hotel.amenities) ? hotel.amenities : [],
          selectedCurrency, // Pass selected currency
          exchangeRates,
        },
      });
    }, 2000);
  };

  const data = [
    { id: 1, image: "/images/Aberdeen.jpg", height: 400 },
    { id: 2, image: "/images/Belfast.jpg", height: 300 },
    { id: 3, image: "/images/Birmingham.jpg", height: 300 },
    { id: 4, image: "/images/Bristol.jpg", height: 300 },
    { id: 5, image: "/images/Cardiff.jpg", height: 300 },
    { id: 6, image: "/images/Edinburgh.jpg", height: 300 },
    { id: 7, image: "/images/Glasgow.jpg", height: 200 },
    { id: 8, image: "/images/London.jpg", height: 300 },
    { id: 9, image: "/images/Manchester.jpg", height: 200 },
    { id: 10, image: "/images/Newcastle.jpg", height: 400 },
    { id: 11, image: "/images/Norwich.jpg", height: 350 },
    { id: 12, image: "/images/Nottingham.jpg", height: 250 },
    { id: 13, image: "/images/Oxford.jpg", height: 300 },
    { id: 14, image: "/images/Plymouth.jpg", height: 300 },
    { id: 15, image: "/images/Swansea.jpg", height: 250 },
    { id: 16, image: "/images/Bournemouth.jpg", height: 350 },
    { id: 17, image: "/images/Kent.jpg", height: 300 },
  ];

  return (
    <div className="booking-container" style={{ marginTop: '120px' }}>
      <h2 className="hotel-title">{hotel.name}</h2>
      <p className="hotel-description">{hotel.description}</p>

      <Tabs className="booking-tabs">
        <TabList className="tab-list">
          <Tab className="tab">Booking</Tab>
          <Tab className="tab">Gallery</Tab>
        </TabList>

        <TabPanel>
          <Card>
            <CardContent>
              <h3>Amenities:</h3>
              <p>{Array.isArray(hotel.amenities) ? hotel.amenities.join(", ") : hotel.amenities || "No amenities available"}</p>

              <h3>Rating:</h3>
              <p>{hotel.rating}</p>

              <h3>Price:</h3>
              <p>Base Price: {hotel.price} USD</p>

              <FormControl fullWidth>
                <InputLabel>Room Type</InputLabel>
                <Select value={roomType} onChange={handleRoomChange}>
                  <MenuItem value="Standard">Standard Room</MenuItem>
                  <MenuItem value="Double">Double Room</MenuItem>
                  <MenuItem value="Family">Family Room</MenuItem>
                </Select>
              </FormControl>

              <h3>Number of Guests:</h3>
              <TextField
                type="number"
                value={numGuests}
                onChange={handleGuestChange}
                fullWidth
                inputProps={{ min: 1, max: roomType === "Standard" ? 1 : roomType === "Double" ? 2 : 4 }}
              />

              <h3>Check-in Date:</h3>
              <TextField
                type="date"
                value={checkInDate}
                onChange={handleCheckInChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <h3>Check-out Date:</h3>
              <TextField
                type="date"
                value={checkOutDate}
                onChange={handleCheckOutChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />

              {isLongStay && <p className="warning-message">You can only book a maximum of 30 days in one booking. Please make separate bookings if you need a longer stay.</p>}

              <h3>Total Price:</h3>
              <p>{convertPrice(totalPrice)} {selectedCurrency}</p>

              <h3>Discount:</h3>
              <p>{discount}% (Applied {daysInAdvance} days in advance)</p>

              <h3>Cancellation Charges (if applicable):</h3>
              <p>{convertPrice(cancellationCharges)} {selectedCurrency}</p>

              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select value={selectedCurrency} onChange={handleCurrencyChange}>
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
                  <MenuItem value="INR">INR</MenuItem>
                  {/* Add more currencies as needed */}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleBookNow}
                style={{ marginTop: "20px" }}
              >
                Book Now
              </Button>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel>
          <div className="gallery-section">
            <Masonry data={data} />
          </div>
        </TabPanel>
      </Tabs>

      {bookingSuccess && (
        <div className="booking-success">
          <h3>Your booking was successful!</h3>
          <p>Booking ID: {bookingId}</p>
        </div>
      )}
    </div>
  );
}

export default Booking;

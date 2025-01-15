import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  Grid,
  Typography,
  Box
} from "@mui/material";
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
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [exchangeRates, setExchangeRates] = useState({});

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
        setExchangeRates(rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };
    fetchExchangeRates();
  }, []);

  const convertPrice = (price) => {
    if (!exchangeRates[selectedCurrency]) return price;
    return (price * exchangeRates[selectedCurrency]).toFixed(2);
  };

  // Logic to determine if the selected check-in date is in the peak or off-peak season
  const checkSeason = (date) => {
    const checkIn = new Date(date);
    const month = checkIn.getMonth() + 1;
    return peakSeasonMonths.includes(month) ? "peak" : "off-peak";
  };

  useEffect(() => {
    let basePrice = hotel.price;
    let roomPrice = basePrice;

    const season = checkSeason(checkInDate);
    let priceToUse = season === "peak" ? hotel.standard_rate_peak : hotel.standard_rate_off_peak;

    roomPrice = priceToUse;

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

  // Discount logic based on days in advance
  useEffect(() => {
    if (daysInAdvance >= 80 && daysInAdvance <= 90) {
      setDiscount(30);
    } else if (daysInAdvance >= 60 && daysInAdvance < 80) {
      setDiscount(20);
    } else if (daysInAdvance >= 45 && daysInAdvance < 60) {
      setDiscount(10);
    } else {
      setDiscount(0);
    }
  }, [daysInAdvance]);

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
    const selectedCheckOutDate = event.target.value;
    // Ensure checkout date is not before check-in date
    if (new Date(selectedCheckOutDate) < new Date(checkInDate)) {
      alert("Checkout date cannot be before check-in date.");
      setCheckOutDate(checkInDate); // Reset to check-in date if invalid
    } else {
      setCheckOutDate(selectedCheckOutDate);

      // Check if the duration exceeds 30 days
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(selectedCheckOutDate);
      const stayDuration = (checkOut - checkIn) / (1000 * 60 * 60 * 24);

      if (stayDuration > 30) {
        alert("You can only book a maximum of 30 days in one booking.");
        setCheckOutDate(checkInDate); // Reset checkout date if duration exceeds 30 days
      }
      setIsLongStay(stayDuration > 30);
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
          selectedCurrency,
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

  // Get today's date for check-in date validation
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="booking-container" style={{ marginTop: '120px' }}>
      <Typography variant="h3" className="hotel-title" align="center">{hotel.name}</Typography>
      <Typography variant="body1" className="hotel-description" align="center" sx={{ marginBottom: 3 }}>{hotel.description}</Typography>

      <Tabs>
        <TabList>
          <Tab>Booking</Tab>
          <Tab>Gallery</Tab>
        </TabList>

        <TabPanel>
          <Card sx={{ marginBottom: 2, padding: 3 }}>
            <CardContent>
              <Typography variant="h6">Amenities:</Typography>
              <Typography variant="body2">
                {Array.isArray(hotel.amenities) ? hotel.amenities.join(", ") : hotel.amenities || "No amenities available"}
              </Typography>

              <Typography variant="h6" sx={{ marginTop: 2 }}>Rating:</Typography>
              <Typography variant="body2">{hotel.rating}</Typography>

              <Typography variant="h6" sx={{ marginTop: 2 }}>Price:</Typography>
              <Typography variant="body2">Base Price: {hotel.price} USD</Typography>

              <FormControl fullWidth sx={{ marginTop: 2 }}>
                <InputLabel>Room Type</InputLabel>
                <Select value={roomType} onChange={handleRoomChange}>
                  <MenuItem value="Standard">Standard Room</MenuItem>
                  <MenuItem value="Double">Double Room</MenuItem>
                  <MenuItem value="Family">Family Room</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="h6" sx={{ marginTop: 2 }}>Number of Guests:</Typography>
              <FormControl fullWidth sx={{ marginTop: 1 }}>
                <Select
                  value={numGuests}
                  onChange={handleGuestChange}
                  disabled={roomType === "Standard" && numGuests === 1}
                >
                  <MenuItem value={1}>1 Guest</MenuItem>
                  {roomType !== "Standard" && <MenuItem value={2}>2 Guests</MenuItem>}
                  {roomType === "Family" && <MenuItem value={3}>3 Guests</MenuItem>}
                  {roomType === "Family" && <MenuItem value={4}>4 Guests</MenuItem>}
                </Select>
              </FormControl>

              <Typography variant="h6" sx={{ marginTop: 2 }}>Check-in Date:</Typography>
              <TextField
                type="date"
                value={checkInDate}
                onChange={handleCheckInChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: today }}  // Prevent past dates for check-in
              />

              <Typography variant="h6" sx={{ marginTop: 2 }}>Check-out Date:</Typography>
              <TextField
                type="date"
                value={checkOutDate}
                onChange={handleCheckOutChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: checkInDate }}  // Prevent checkout before check-in
              />

              {isLongStay && (
                <Typography variant="body2" color="error" sx={{ marginTop: 2 }}>
                  You can only book a maximum of 30 days in one booking.
                </Typography>
              )}

              <Typography variant="h6" sx={{ marginTop: 2 }}>Total Price:</Typography>
              <Typography variant="body2">{convertPrice(totalPrice)} {selectedCurrency}</Typography>

              <Typography variant="h6" sx={{ marginTop: 2 }}>Discount:</Typography>
              <Typography variant="body2">{discount}% (Applied {Math.floor((new Date(checkInDate) - currentDate) / (1000 * 60 * 60 * 24))} days in advance)</Typography>

              <Typography variant="h6" sx={{ marginTop: 2 }}>Cancellation Charges (if applicable):</Typography>
              <Typography variant="body2">{convertPrice(cancellationCharges)} {selectedCurrency}</Typography>

              <FormControl fullWidth sx={{ marginTop: 2 }}>
                <InputLabel>Currency</InputLabel>
                <Select value={selectedCurrency} onChange={handleCurrencyChange}>
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
                  <MenuItem value="INR">INR</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleBookNow}
                sx={{ marginTop: 2 }}
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
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h5" color="success.main">Your booking was successful!</Typography>
          <Typography variant="body1">Booking ID: {bookingId}</Typography>
        </Box>
      )}
    </div>
  );
}

export default Booking;

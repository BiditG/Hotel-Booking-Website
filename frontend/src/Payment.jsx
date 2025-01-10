// Payment.js (Updated)
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Typography, RadioGroup, FormControlLabel, Radio, Checkbox, FormControl, FormLabel, Box } from '@mui/material';
import "./Payment.css";

function Payment() {
    const location = useLocation();
    const { hotel, totalPrice, bookingId } = location.state || {};
    const [paymentMethod, setPaymentMethod] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const navigate = useNavigate();
    const numericTotalPrice = parseFloat(totalPrice);

    const handlePayment = async () => {
        if (!paymentMethod || !acceptedTerms) {
            alert("Please select a payment method and accept the terms.");
            return;
        }
    
        try {
            const paymentData = {
                bookingId,
                amount: numericTotalPrice.toFixed(2),
                paymentMethod,
                date: new Date().toISOString(),
            };
    
            const response = await fetch("http://localhost:5000/api/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(paymentData),
                credentials: "include",
            });
    
            if (response.ok) {
                alert("Payment successful! Your booking is confirmed. 🎉");
                await fetch("http://localhost:5000/api/confirm_booking", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ bookingId }),
                    credentials: "include",
                });
                navigate("/cart");
            } else {
                alert("Payment failed. Please try again. 😔");
            }
        } catch (error) {
            console.error("Error processing payment:", error);
            alert("An error occurred during payment. 😞");
        }
    };
    
    return (
        <div className="payment-container" style={{marginTop: '120px'}}>
            <Box sx={{ textAlign: 'center', marginBottom: 3 }}>
                <Typography variant="h4" gutterBottom>🏨 Payment Page 🏨</Typography>
                <Typography variant="h6">Hotel: {hotel?.name}</Typography>
                <Typography><strong>Total Amount:</strong> ${numericTotalPrice.toFixed(2)}</Typography>
                <Typography><strong>Booking ID:</strong> {bookingId}</Typography>
            </Box>

            <Box sx={{ marginBottom: 3 }}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">💳 Select Payment Method</FormLabel>
                    <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                        {["Credit Card", "Debit Card", "PayPal", "Net Banking"].map((method) => (
                            <FormControlLabel key={method} value={method} control={<Radio />} label={method} />
                        ))}
                    </RadioGroup>
                </FormControl>
            </Box>

            <FormControlLabel
                control={<Checkbox checked={acceptedTerms} onChange={() => setAcceptedTerms(!acceptedTerms)} />}
                label="I accept the Terms and Conditions ✅"
            />
            <Button variant="contained" color="primary" onClick={handlePayment} disabled={!acceptedTerms}>
                Pay Now 💸
            </Button>
        </div>
    );
}

export default Payment;

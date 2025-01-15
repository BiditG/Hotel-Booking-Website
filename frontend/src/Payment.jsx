import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Typography, RadioGroup, FormControlLabel, Radio, Checkbox, FormControl, FormLabel, Box, Grid, Modal, Card, CardContent } from '@mui/material';
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";  // Icons for Visa and Mastercard
import "./Payment.css";

function Payment() {
    const location = useLocation();
    const { hotel, totalPrice, bookingId, selectedCurrency } = location.state || {};  // Get totalPrice from Cart.js
    const [paymentMethod, setPaymentMethod] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [showTerms, setShowTerms] = useState(false); // State to control Terms modal visibility
    const navigate = useNavigate();
    const numericTotalPrice = parseFloat(totalPrice);  // Converted total price already passed from Cart.js

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

    const handleShowTerms = () => {
        setShowTerms(true);
    };

    const handleCloseTerms = () => {
        setShowTerms(false);
    };

    return (
        <div className="payment-container" style={{ marginTop: '100px', padding: '20px', backgroundColor: '#f9f9f9' }}>
            <Box sx={{ textAlign: 'center', marginBottom: 3, maxWidth: '800px', margin: '0 auto' }}>
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#1d3557' }}>🏨 Payment Page 🏨</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3e4e61' }}>Hotel: {hotel?.name}</Typography>
                <Typography sx={{ fontSize: '1.2rem', marginBottom: '8px' }}><strong>Total Amount:</strong> {numericTotalPrice.toFixed(2)} {selectedCurrency}</Typography>  
                <Typography sx={{ fontSize: '1rem' }}><strong>Booking ID:</strong> {bookingId}</Typography>
            </Box>

            {/* Payment Card Section */}
            <Card sx={{ maxWidth: 600, margin: '0 auto', padding: 3, borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <FormControl component="fieldset" fullWidth>
                                <FormLabel component="legend" sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1d3557' }}>💳 Select Payment Method</FormLabel>
                                <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                    <FormControlLabel 
                                        value="Credit Card" 
                                        control={<Radio />} 
                                        label={<><FaCcVisa style={{ marginRight: '8px' }} /> Visa</>} 
                                    />
                                    <FormControlLabel 
                                        value="Debit Card" 
                                        control={<Radio />} 
                                        label={<><FaCcMastercard style={{ marginRight: '8px' }} /> Mastercard</>} 
                                    />
                                    <FormControlLabel 
                                        value="Paytm" 
                                        control={<Radio />} 
                                        label="Paytm" 
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Terms and Conditions Section */}
            <Grid container spacing={3} justifyContent="center" sx={{ marginTop: 3 }}>
                <Grid item xs={12} sm={6}>
                    <FormControlLabel
                        control={<Checkbox checked={acceptedTerms} onChange={() => setAcceptedTerms(!acceptedTerms)} />}
                        label="I accept the Terms and Conditions ✅"
                    />
                    <Button variant="text" color="primary" onClick={handleShowTerms} sx={{ fontSize: '0.9rem', padding: '0' }}>
                        Show Terms and Conditions
                    </Button>
                </Grid>
            </Grid>

            {/* Pay Now Button */}
            <Box sx={{ marginTop: 3, textAlign: 'center' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePayment}
                    disabled={!acceptedTerms || !paymentMethod}
                    sx={{ width: '200px', fontSize: '16px', textTransform: 'none', backgroundColor: '#1d3557', '&:hover': { backgroundColor: '#3e4e61' } }}
                >
                    Pay Now 💸
                </Button>
            </Box>

            {/* Terms and Conditions Modal */}
            <Modal
                open={showTerms}
                onClose={handleCloseTerms}
                aria-labelledby="terms-modal-title"
                aria-describedby="terms-modal-description"
            >
                <Box sx={{ 
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    bgcolor: 'white', padding: 4, borderRadius: 2, width: '80%', maxWidth: '600px',
                    boxShadow: 24, overflowY: 'auto', maxHeight: '500px'
                }}>
                    <Typography variant="h6" id="terms-modal-title" gutterBottom sx={{ fontWeight: 'bold' }}>Terms and Conditions</Typography>
                    <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <Typography id="terms-modal-description" variant="body2" sx={{ marginBottom: 2 }}>
                            Please read our Terms and Conditions carefully before making a payment.
                            <br /><br />
                            1. All payments are final and non-refundable after processing.<br />
                            2. Bookings can be modified up to 24 hours before check-in.<br />
                            3. We reserve the right to cancel bookings in case of non-payment.<br />
                            <br />
                            By completing the payment, you agree to these terms and conditions.
                        </Typography>
                    </Box>
                    <Button variant="contained" color="secondary" onClick={handleCloseTerms}>
                        Close
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}

export default Payment;

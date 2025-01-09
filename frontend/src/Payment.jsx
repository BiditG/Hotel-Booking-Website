import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.css";

function Payment() {
    const location = useLocation();
    const { hotel, totalPrice, bookingId } = location.state || {};
    const [paymentMethod, setPaymentMethod] = useState("");
    const navigate = useNavigate();

    // Ensure totalPrice is treated as a number
    const numericTotalPrice = parseFloat(totalPrice);

    const handlePayment = async () => {
        if (!paymentMethod) {
            alert("Please select a payment method.");
            return;
        }

        try {
            const paymentData = {
                bookingId,
                amount: numericTotalPrice.toFixed(2), // Using the fixed numeric value
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
                alert("Payment successful! Your booking is confirmed.");
                navigate("/transcript", { state: { bookingId } });
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Payment failed. Please try again.");
            }
        } catch (error) {
            console.error("Error processing payment:", error);
            alert("An error occurred during payment.");
        }
    };

    return (
        <div className="payment-container">
            <h2 className="payment-title">Payment Page</h2>
            <div className="payment-details">
                <h3>Hotel: {hotel?.name || "Hotel Name"}</h3>
                <p><strong>Total Amount:</strong> ${numericTotalPrice.toFixed(2)}</p>
                <p><strong>Booking ID:</strong> {bookingId || "N/A"}</p>

                <div className="payment-methods">
                    <h4>Select Payment Method</h4>
                    {["Credit Card", "Debit Card", "PayPal", "Net Banking"].map((method) => (
                        <label key={method}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={method}
                                checked={paymentMethod === method}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            {method}
                        </label>
                    ))}
                </div>

                <button className="pay-now-button" onClick={handlePayment}>
                    Pay Now
                </button>
            </div>
        </div>
    );
}

export default Payment;

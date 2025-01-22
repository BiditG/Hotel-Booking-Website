import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";

const AIChatModal = () => {
  const [messages, setMessages] = useState([]); // Stores the conversation
  const [userInput, setUserInput] = useState(""); // Tracks the user's input
  const [loading, setLoading] = useState(false); // Indicates if AI is processing
  const [error, setError] = useState(null); // Handles errors

  // Initial message when the dashboard loads
  useEffect(() => {
    setMessages([
      {
        sender: "AI",
        text: "Welcome to the AI Analysis Dashboard! Ask me about sales, ratings, profits, or the highest spender.",
      },
    ]);
  }, []);

  // Handle user message submission
  const handleSendMessage = async () => {
    if (!userInput.trim()) return; // Ignore empty messages

    const userMessage = { sender: "User", text: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");

    try {
      setLoading(true);
      setError(null);

      console.log("Sending request to the backend...");

      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: userInput }), // Corrected key to 'query'
      });

      console.log("Response received:", response);

      if (!response.ok) {
        console.error("Response not OK:", response.statusText);
        throw new Error(`Backend Error: ${response.statusText}`);
      }

      const aiResponse = await response.json();

      console.log("AI Response data:", aiResponse);

      const aiMessage = {
        sender: "AI",
        text: aiResponse.response || "Sorry, I could not process that.",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Error during API call:", err.message);
      setError(err.message || "An error occurred while processing your query.");
    } finally {
      setLoading(false);
    }
  };

  const dashboardStyle = {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    padding: "20px",
    boxSizing: "border-box",
  };

  const chatBoxStyle = {
    flex: 1,
    overflowY: "auto",
    border: "1px solid #ddd",
    borderRadius: "4px",
    padding: "10px",
    marginBottom: "10px",
  };

  const inputAreaStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const messageStyle = (sender) => ({
    textAlign: sender === "AI" ? "left" : "right",
    margin: "5px 0",
  });

  return (
    <Box sx={dashboardStyle}>
      <Typography variant="h4" gutterBottom>
        A.I. Analysis Dashboard
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Chat Box */}
      <Box sx={chatBoxStyle}>
        {messages.map((msg, index) => (
          <Typography
            key={index}
            sx={messageStyle(msg.sender)}
            color={msg.sender === "AI" ? "text.primary" : "primary.main"}
          >
            <strong>{msg.sender}:</strong> {msg.text}
          </Typography>
        ))}
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" sx={{ mb: 2 }}>
          <CircularProgress size={20} />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Input Area */}
      <Box sx={inputAreaStyle}>
        <TextField
          fullWidth
          placeholder="Type your query..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={loading}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default AIChatModal;

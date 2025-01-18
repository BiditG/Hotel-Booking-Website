import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Box,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  VolumeUp as VolumeUpIcon,
} from "@mui/icons-material";
import ReactEmoji from "react-emoji"; // Install with `npm install react-emoji`
import { styled } from "@mui/material/styles";

/* Styled Components */

/**
 * Container for the chat messages.
 * Implements vertical scrolling and ensures no horizontal overflow.
 */
const MessagesContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  overflowY: "auto",
  overflowX: "hidden",
  backgroundColor: "#f5f5f5",
}));

/**
 * Wrapper for individual messages.
 * Aligns messages based on the sender.
 */
const MessageWrapper = styled(Box)(({ theme, sender }) => ({
  display: "flex",
  justifyContent: sender === "User" ? "flex-end" : "flex-start",
  marginBottom: theme.spacing(1.5),
  alignItems: "flex-end",
}));

/**
 * Styled message bubble using Box and Typography for better text handling.
 */
const MessageBubble = styled(Box)(({ theme, sender }) => ({
  maxWidth: "80%",
  padding: theme.spacing(1, 2),
  backgroundColor:
    sender === "User" ? theme.palette.primary.main : theme.palette.grey[300],
  color: sender === "User" ? "#fff" : "#000", // Ensure text color is white for user
  borderRadius: "20px",
  boxShadow: theme.shadows[1],
  wordBreak: "break-word",
  position: "relative",
}));

/**
 * Container for the input field and action buttons.
 */
const InputContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: "#e3f2fd",
}));

/**
 * Chat Component
 * A redesigned chatbot interface with enhanced UI/UX and overflow prevention.
 */
function Chat() {
  // State variables
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);

  // Reference to the end of messages for auto-scrolling
  const messagesEndRef = useRef(null);

  // Speech Recognition Setup
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  // Auto-scroll to the latest message when messages change
  useEffect(() => {
    if (drawerOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, drawerOpen]);

  // Common predefined questions for quick replies
  const commonQuestions = [
    "What services do you offer? 😊",
    "How can I book a room? 🏨",
    "What is your cancellation policy? 🔄",
    "Are there any ongoing offers? 💰",
    "Can I modify my booking? ✏️",
  ];

  /**
   * Sends a message either from user input or predefined question.
   * @param {string} message - The message to send.
   */
  const sendMessage = async (message) => {
    const userMessage = message || userInput.trim();
    if (!userMessage) return;

    // Create a new user message object
    const newMessage = {
      sender: "User",
      text: userMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Update messages state with the new user message
    setMessages((prev) => [...prev, newMessage]);
    setLoading(true);
    setIsTyping(true);
    setError(null);

    try {
      // Send the user message to the backend API
      const response = await axios.post("http://localhost:5000/chat", {
        user_input: userMessage,
      });
      const aiResponse = response.data.response;

      // Create a new AI message object
      const aiMessage = {
        sender: "AI",
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      // Update messages state with the new AI message
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("There was an error processing your request. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          sender: "AI",
          text: "Sorry, there was an error processing your request.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setUserInput("");
      setLoading(false);
      setIsTyping(false);
    }
  };

  /**
   * Toggles the chat drawer open/close state.
   */
  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  /**
   * Handles the microphone button click for speech recognition.
   */
  const handleMicClick = () => {
    if (!recognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }

    // Handle the result from speech recognition
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript);
      setIsRecording(false);
      sendMessage(transcript);
    };

    // Handle speech recognition errors
    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setError("Speech recognition error. Please try again.");
      setIsRecording(false);
    };
  };

  /**
   * Handles the text-to-speech for AI messages.
   * @param {string} text - The text to be spoken.
   */
  const handleSpeak = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Chat Sidebar Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 400 },
            borderRadius: "15px 0 0 15px",
          },
        }}
        aria-label="Chat Drawer"
      >
        {/* AppBar within Drawer */}
        <AppBar
          position="static"
          color="primary"
          sx={{ borderRadius: "15px 15px 0 0" }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Chat with Us
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={toggleDrawer}
              aria-label="Close Chat"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Messages Container */}
        <MessagesContainer>
          {/* No Messages Placeholder */}
          {messages.length === 0 && !loading ? (
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              sx={{ marginTop: 2 }}
            >
              No messages yet. Start the conversation!
            </Typography>
          ) : (
            // Render Messages
            messages.map((message, index) => (
              <MessageWrapper key={index} sender={message.sender}>
                {message.sender === "AI" && (
                  <Avatar
                    sx={{ width: 32, height: 32, mr: 1 }}
                    src="/ai-avatar.png" // Replace with actual AI avatar if available
                    alt="AI Avatar"
                  >
                    AI
                  </Avatar>
                )}
                <Box position="relative">
                  <MessageBubble sender={message.sender}>
                    <Typography variant="body1" color="inherit">
                      {ReactEmoji.emojify(message.text)}
                    </Typography>
                  </MessageBubble>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{
                      position: "absolute",
                      bottom: -18,
                      right: 0,
                      fontSize: "0.7rem",
                    }}
                  >
                    {message.timestamp}
                  </Typography>
                  {message.sender === "AI" && (
                    <Tooltip title="Listen">
                      <IconButton
                        size="small"
                        onClick={() => handleSpeak(message.text)}
                        sx={{
                          position: "absolute",
                          top: "50%",
                          right: -30,
                          transform: "translateY(-50%)",
                        }}
                        aria-label="Listen to AI message"
                      >
                        <VolumeUpIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                {message.sender === "User" && (
                  <Avatar
                    sx={{ width: 32, height: 32, ml: 1 }}
                    src="/user-avatar.png" // Replace with actual user avatar if available
                    alt="User Avatar"
                  >
                    U
                  </Avatar>
                )}
              </MessageWrapper>
            ))
          )}

          {/* Loading Indicator */}
          {loading && (
            <Box display="flex" justifyContent="center" alignItems="center" my={2}>
              <CircularProgress size={24} />
            </Box>
          )}

          {/* AI Typing Indicator */}
          {isTyping && (
            <Box display="flex" alignItems="center" mt={1} mb={2} ml={2}>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              <Typography variant="body2" color="textSecondary">
                AI is typing...
              </Typography>
            </Box>
          )}

          {/* Error Message */}
          {error && (
            <Box display="flex" justifyContent="center" alignItems="center" my={2}>
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            </Box>
          )}

          {/* Reference Element for Auto-Scroll */}
          <div ref={messagesEndRef} />
        </MessagesContainer>

        <Divider />

        {/* Input and Quick Replies */}
        <Box sx={{ padding: 2 }}>
          {/* Quick Reply Buttons */}
          <Box mb={2} display="flex" flexWrap="wrap" gap={1}>
            {commonQuestions.map((question, index) => (
              <Button
                key={index}
                variant="contained"
                size="small"
                onClick={() => sendMessage(question)}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#1976d2",
                  "&:hover": {
                    backgroundColor: "#115293",
                  },
                }}
                aria-label={`Quick reply: ${question}`}
              >
                {ReactEmoji.emojify(question)}
              </Button>
            ))}
          </Box>

          {/* Input Container */}
          <InputContainer>
            <TextField
              fullWidth
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              size="small"
              variant="outlined"
              sx={{
                borderRadius: "20px",
                backgroundColor: "#fff",
              }}
              aria-label="Type your message"
            />
            <Tooltip title={isRecording ? "Stop Recording" : "Start Recording"}>
              <IconButton
                color={isRecording ? "secondary" : "primary"}
                onClick={handleMicClick}
                aria-label={
                  isRecording ? "Stop Recording" : "Start Recording"
                }
              >
                {isRecording ? <MicOffIcon /> : <MicIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Send">
              <span>
                <IconButton
                  color="primary"
                  onClick={sendMessage}
                  disabled={loading || !userInput.trim()}
                  sx={{
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#115293",
                    },
                  }}
                  aria-label="Send Message"
                >
                  <SendIcon />
                </IconButton>
              </span>
            </Tooltip>
          </InputContainer>
        </Box>
      </Drawer>

      {/* Floating Chat Button */}
      <Tooltip title={drawerOpen ? "Close Chat" : "Open Chat"} placement="left">
        <IconButton
          color="primary"
          onClick={toggleDrawer}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1300,
            backgroundColor: "#1976d2",
            color: "#fff",
            width: 60,
            height: 60,
            "&:hover": {
              backgroundColor: "#115293",
            },
            boxShadow: 3,
          }}
          aria-label={drawerOpen ? "Close Chat" : "Open Chat"}
        >
          {drawerOpen ? <CloseIcon /> : <ChatIcon />}
        </IconButton>
      </Tooltip>
    </>
  );
}

export default Chat;

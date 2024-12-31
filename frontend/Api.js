import axios from "axios";

const API_URL = "http://localhost:5000/api";  // Your Flask backend URL

// Function for signing up
export const signup = async (username, email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/signup`,
      { username, email, password },
      { withCredentials: true } // Include credentials (cookies) in the request
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Function for logging in
export const login = async (username, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      { username, password },
      { withCredentials: true } // Include credentials (cookies) in the request
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Function to check if the user is authenticated
export const checkAuth = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth`, { withCredentials: true });
    return response.data;
  } catch (error) {
    return { authenticated: false };
  }
};

// Function for logging out
export const logout = async () => {
  try {
    const response = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/preferences"; // Adjust if needed

export const savePreferences = async (preferences) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/save`, preferences);
    return response.data;
  } catch (error) {
    console.error("Error saving preferences:", error);
    throw error;
  }
};

export const getUserPreferences = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching preferences:", error);
    throw error;
  }
};

export const generateItinerary = async (userId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/generate-itinerary`, { userId });
    return response.data;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw error;
  }
};

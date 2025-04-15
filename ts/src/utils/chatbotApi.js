import axios from "axios";

// If you're in development and backend is running on localhost:5000,
// this works. In production, change to relative path or use env variable.
const CHATBOT_API_URL = "http://localhost:5000/api/chat";

const sendChatToBot = async (message) => {
  try {
    const response = await axios.post(CHATBOT_API_URL, { message });

    if (response.data && response.data.reply) {
      return response.data.reply;
    } else {
      console.error("No 'reply' found in chatbot response:", response.data);
      return "Hmm... I didn't get a valid response.";
    }

  } catch (error) {
    if (error.response) {
      console.error("Chatbot backend responded with error:", error.response.data);
    } else if (error.request) {
      console.error("No response received from chatbot backend:", error.request);
    } else {
      console.error("Error sending message to chatbot:", error.message);
    }
    return "Oops! I couldn't reach the bot. Please try again later.";
  }
};

export default sendChatToBot;

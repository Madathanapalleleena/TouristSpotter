import axios from "axios";

const CHATBOT_API_URL = "http://localhost:5000/api/chat";

const sendChatToBot = async (message) => {
  try {
    const response = await axios.post(CHATBOT_API_URL, { message });
    return response.data.reply;
  } catch (error) {
    console.error("Error communicating with chatbot:", error);
    return "Oops! I couldn't reach the bot.";
  }
};

export default sendChatToBot;

// server.js
require("dotenv").config(); 
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const preferencesRoutes = require("./routes/preferences");
const visitRoutes = require("./routes/visitRoutes");
const chatRoutes = require("./routes/chatRoutes"); // ✅ Add chatbot routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB before starting the server
const startServer = async () => {
  try {
    await connectDB(); // Connect to MongoDB 
    console.log("✅ MongoDB Connected Successfully");

    // Register routes
    app.use("/api/users", authRoutes);
    app.use("/api/preferences", preferencesRoutes);
    app.use("/api/visit", visitRoutes);
    app.use("/api/chat", chatRoutes); // Chatbot route

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

startServer();

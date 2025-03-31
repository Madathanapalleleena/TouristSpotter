require("dotenv").config(); // Load environment variables at the top

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); 
const preferencesRoutes = require("./routes/preferences");
//const preferencesRoutes = require("./routes/preferencesRoutes");
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB before starting the server
const startServer = async () => {
  try {
    await connectDB(); // Ensure database is connected
    console.log("✅ MongoDB Connected Successfully");

    // ✅ Use routes AFTER database connection
    // ✅ Register routes for authentication & preferences
    //app.use("/api/users", require("./routes/userRoutes"));
    app.use("/api/preferences", preferencesRoutes);

    // ✅ Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1); // Exit process if DB connection fails
  }
};

// ✅ Start the server
startServer();

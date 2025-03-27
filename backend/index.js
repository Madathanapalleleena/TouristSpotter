const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const preferencesRoutes = require("./routes/preferences");

dotenv.config(); // Load environment variables

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors()); // Enable CORS to prevent frontend issues

// ✅ Routes
app.use("/api/preferences", preferencesRoutes);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// ✅ Error Handling Middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// ✅ Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

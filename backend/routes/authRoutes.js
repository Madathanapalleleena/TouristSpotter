const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Register Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields (NEW CHANGE)
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields (name, email, password) are required" });
    }

    // ✅ Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
      });
    }

    // ✅ Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "User already exists" });

    // ✅ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Save user
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    // ✅ JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, userId: user._id, name: user.name, email: user.email });
  } catch (error) {
    console.error("❌ Error in /register:", error);
    res.status(500).json({ error: "Server error" });
  }
});
// ✅ Login Route
// ✅ Login Route - Make sure it sends token correctly
router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: "Invalid email or password" });

      console.log("User found:", user); // ✅ Debugging

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

      // ✅ Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      console.log("Sending response:", { token, user }); // ✅ Debugging

      // ✅ Fix: Ensure user object is structured properly
      res.json({ 
        token, 
        user: { _id: user._id, name: user.name, email: user.email }  
      });

    } catch (error) {
      console.error("❌ Error in /register:", error);
      res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
    
});

// ✅ Get User Profile (Protected)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

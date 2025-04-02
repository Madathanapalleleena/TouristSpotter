const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");  // Import the auth middleware
const User = require("../models/User");

const router = express.Router();

// Update User Profile Route (protected)
router.put("/profile", authMiddleware, async (req, res) => {
  const { name, email } = req.body;  // Assuming these are the fields to be updated
  
  try {
    // Find the user by ID and update their profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,  // Get the user ID from the token
      { name, email },  // Update the name and email
      { new: true }  // Return the updated user
    );

    res.json(updatedUser);  // Return the updated user data
  } catch (err) {
    res.status(500).json({ error: "Something went wrong!" });
  }
});

module.exports = router;

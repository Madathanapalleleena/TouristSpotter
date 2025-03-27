const express = require("express");
const router = express.Router();
const UserPreferences = require("../models/UserPreferences");
const Itinerary = require("../models/Itinerary");
const { generateItinerary } = require("../services/openaiServices");

// Generate and store itinerary
router.get("/generate-itinerary/:userId", async (req, res) => {
  try {
    const preferences = await UserPreferences.findOne({ userId: req.params.userId });

    if (!preferences) {
      return res.status(404).json({ success: false, message: "User preferences not found" });
    }

    // ✅ Format preferences correctly for OpenAI
    const formattedPreferences = preferences.getFormattedPreferences();

    // ✅ Call OpenAI
    const itineraryText = await generateItinerary(formattedPreferences);

    // ✅ Store in MongoDB
    const newItinerary = new Itinerary({
      userId: req.params.userId,
      preferences: formattedPreferences,
      itineraryText
    });

    await newItinerary.save();

    res.json({ success: true, itinerary: itineraryText });
  } catch (error) {
    console.error("❌ Error generating itinerary:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;

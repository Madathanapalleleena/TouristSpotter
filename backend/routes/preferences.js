const express = require("express");
const router = express.Router();
const {
    savePreferences,
    getPreferences,
    updateUserPreferences,
    generateItinerary
} = require("../controllers/preferencesController");
// ✅ Log the Gemini API response


// ✅ Define Routes
router.post("/save", savePreferences);
router.get("/:userId", getPreferences);
router.put("/update/:userId", updateUserPreferences);
router.get("/generate-itinerary/:userId", generateItinerary);
router.post("/generate-itinerary/:userId", generateItinerary);
module.exports = router;

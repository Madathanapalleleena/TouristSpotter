const express = require("express");
const router = express.Router();
const { generateItinerary } = require("../geminiService");

router.post("/generate-itinerary", async (req, res) => {
    try {
        const { interests, duration, location, selectedPlaces } = req.body;
        
        const prompt = `Create a ${duration}-day itinerary for a trip to ${location} including places: ${selectedPlaces.join(", ")}. Interests: ${interests.join(", ")}.`;

        const itinerary = await generateItinerary(prompt);
        
        res.status(200).json({ itinerary });
    } catch (error) {
        res.status(500).json({ message: "Error generating itinerary", error });
    }
});

module.exports = router;

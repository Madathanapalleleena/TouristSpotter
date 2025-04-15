const express = require("express");
const router = express.Router();
const { generateItinerary } = require("../geminiService");

router.post("/generate-itinerary", async (req, res) => {
  try {

    const { interests, duration, location, transportMedium, selectedPlaces } = req.body;

   
    const placesText = selectedPlaces && selectedPlaces.length > 0 
      ? selectedPlaces.join(", ") 
      : "No specific places selected, please suggest based on interests.";


      const prompt = `
Create a detailed ${duration}-day travel itinerary for a trip to ${location}.

**User Preferences:**
- Interests: ${interests.join(", ")}
- Selected Tourist Places: ${selectedPlaces.join(", ")}
- Preferred Transport: ${transportMedium}

**Instructions:**
1. Organize the itinerary day-wise.
2. Include place names, brief descriptions, and suggested time slots.
3. Consider travel time between locations using ${transportMedium}.
4. Include cultural or food recommendations (if relevant).
5. Mention any entry fees, opening hours, or booking tips.
6. Add user-friendly notes or reminders like:
   - Carry ID cards
   - Best times to visit
   - Clothing suggestions (if applicable)
   - Safety/weather tips
7. At the end, include a **"User Note"** section summarizing important advice for this itinerary.

Make the output clear, friendly, and helpful for a traveler.
`;

    const itinerary = await generateItinerary(prompt);
    
   
    res.status(200).json({ itinerary });
  } catch (error) {
    
    res.status(500).json({ message: "Error generating itinerary", error });
  }
});

module.exports = router;

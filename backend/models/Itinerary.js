const express = require("express");
const router = express.Router();
const { generateItinerary } = require("../geminiService");

router.post("/generate-itinerary", async (req, res) => {
  try {
    // Extract user inputs from request body
    const { interests, duration, location, transportMedium, selectedPlaces } = req.body;

    // Constructing the placesText string based on selected places
    const placesText = selectedPlaces && selectedPlaces.length > 0 
      ? selectedPlaces.join(", ") 
      : "No specific places selected, please suggest based on interests.";

    // Construct the prompt for itinerary generation
    const prompt = `
      <strong>Trip Details:</strong><br>
      <ul>
        <li><strong>Duration:</strong> ${duration} days</li>
        <li><strong>Location:</strong> ${location}</li>
        <li><strong>Interests:</strong> ${interests.join(", ")}</li>
        <li><strong>Preferred Transport:</strong> ${transportMedium ? transportMedium : "Not specified"}</li>
        <li><strong>Selected Places:</strong> ${placesText}</li>
      </ul>

      <hr>

      <strong>Itinerary Creation:</strong><br>
      Based on the provided details, I will create a personalized itinerary that includes:
      <ol>
        <li><strong>Recommended places to visit</strong> tailored to your interests and selected places.</li>
        <li><strong>Timings</strong> for each activity to ensure the day is well-planned.</li>
        <li><strong>Travel times</strong> between destinations to optimize your schedule.</li>
      </ol>

      If you haven’t selected any places yet, I will suggest some destinations based on your interests and location, ensuring your trip is packed with the best experiences.<br><br>
      Let's begin by crafting a memorable itinerary for your trip! 😊
    `;

    // Call the generateItinerary function to get the itinerary response
    const itinerary = await generateItinerary(prompt);
    
    // Return the itinerary in the response
    res.status(200).json({ itinerary });
  } catch (error) {
    // Handle any errors that occur during the itinerary generation
    res.status(500).json({ message: "Error generating itinerary", error });
  }
});

module.exports = router;

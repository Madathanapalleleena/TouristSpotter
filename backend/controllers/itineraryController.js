const UserPreferences = require("../models/UserPreferences");
const Itinerary = require("../models/Itinerary");
const { generateItinerary } = require("../services/geminiService");

exports.generateItinerary = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user's preferences in the database
    const preferences = await UserPreferences.findOne({ userId });

    if (!preferences) {
      return res.status(404).json({ message: "User preferences not found" });
    }

    // Format preferences (to be sent as prompt to Gemini)
    const formattedPreferences = preferences.getFormattedPreferences();

    // Generate the itinerary using Gemini API
    let itineraryText = await generateItinerary(formattedPreferences);

    // Ensure we have a valid response from Gemini
    itineraryText = typeof itineraryText === "string" ? itineraryText : "No itinerary generated.";

    // Save the itinerary in the database
    const itinerary = new Itinerary({
      userId,
      preferences: formattedPreferences,
      itineraryText,
    });

    await itinerary.save();

    // Send the generated itinerary as a response
    res.json({
      success: true,
      itinerary: itineraryText,
      message: "Itinerary generated successfully",
    });
  } catch (error) {
    console.error("Error generating itinerary:", error);
    res.status(500).json({ success: false, message: "Error generating itinerary", error });
  }
};
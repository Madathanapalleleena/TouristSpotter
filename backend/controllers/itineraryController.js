const UserPreferences = require("../models/UserPreferences");
const Itinerary = require("../models/Itinerary");
const { generateItinerary } = require("../services/geminiService");

exports.generateItinerary = async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = await UserPreferences.findOne({ userId });
    if (!preferences) return res.status(404).json({ message: "User preferences not found" });

    const formattedPreferences = preferences.getFormattedPreferences();
    let itineraryText = await generateItinerary(formattedPreferences);
    itineraryText = typeof itineraryText === "string" ? itineraryText : "No itinerary generated.";

    const itinerary = new Itinerary({ userId, preferences: formattedPreferences, itineraryText });
    await itinerary.save();

    res.json({ message: "Itinerary generated successfully", itinerary });
  } catch (error) {
    console.error("Error generating itinerary:", error);
    res.status(500).json({ message: "Error generating itinerary", error });
  }
};

const UserPreferences = require("../models/UserPreferences");
require("dotenv").config();
const fetch = require("node-fetch");

/**
 * Save or update user preferences in the database.
 */
exports.savePreferences = async (req, res) => {
    try {
        const { userId, interests, duration, startDate, location, selectedPlaces } = req.body;
        
        // Validate selectedPlaces is an array
        if (!Array.isArray(selectedPlaces)) {
            return res.status(400).json({ error: "selectedPlaces must be an array of objects" });
        }

        let preferences = await UserPreferences.findOne({ userId });

        if (preferences) {
            preferences.interests = interests;
            preferences.duration = duration;
            preferences.startDate = startDate;
            preferences.location = location;
            preferences.selectedPlaces = selectedPlaces;
        } else {
            preferences = new UserPreferences({
                userId,
                interests,
                duration,
                startDate,
                location,
                selectedPlaces,
            });
        }

        await preferences.save();
        res.status(200).json({ message: "Preferences saved successfully", preferences });
    } catch (error) {
        console.error("❌ Error saving preferences:", error);
        res.status(500).json({ message: "Error saving preferences", error });
    }
};

/**
 * Fetch user preferences from the database.
 */
exports.getPreferences = async (req, res) => {
    try {
        const { userId } = req.params;
        const preferences = await UserPreferences.findOne({ userId });

        if (!preferences) {
            return res.status(404).json({ message: "User preferences not found" });
        }

        res.status(200).json(preferences);
    } catch (error) {
        console.error("❌ Error fetching preferences:", error);
        res.status(500).json({ message: "Error fetching preferences", error });
    }
};

/**
 * Update user preferences.
 */
exports.updateUserPreferences = async (req, res) => {
    try {
        const { userId } = req.params;
        const updateData = req.body;

        const updatedPreferences = await UserPreferences.findOneAndUpdate(
            { userId },
            updateData,
            { new: true }
        );

        if (!updatedPreferences) {
            return res.status(404).json({ message: "User preferences not found" });
        }

        res.status(200).json({ message: "Preferences updated successfully", updatedPreferences });
    } catch (error) {
        console.error("❌ Error updating preferences:", error);
        res.status(500).json({ message: "Error updating preferences", error });
    }
};

/**
 * Generate a personalized itinerary using Gemini AI.
 */
exports.generateItinerary = async (req, res) => {
    try {
        const { userId } = req.params;

        // ✅ Fetch user preferences from MongoDB
        const preferences = await UserPreferences.findOne({ userId });
        if (!preferences) {
            return res.status(404).json({ message: "User preferences not found" });
        }

        // ✅ Prepare prompt for Gemini
        const userPrompt = `
        Generate 3 different itinerary plans for a tourist in ${preferences.location}.
        User preferences:
        - Interests: ${preferences.interests.join(", ")}
        - Trip Duration: ${preferences.duration} days
        - Selected Places: ${preferences.selectedPlaces.map(p => p.name).join(", ")}
        - Start Date: ${new Date(preferences.startDate).toDateString()}

        Each itinerary should include a daily schedule, recommended activities, and estimated visit durations.
        `;

        // ✅ Call Google Gemini API
        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userPrompt }] }]
                })
            }
        );
        const geminiData = await geminiResponse.json();
        console.log("🔄 Gemini API Response:", JSON.stringify(geminiData, null, 2));

        // ✅ Extract AI response properly
        const itinerary =
            geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No itinerary generated.";

        // ✅ Send response
        res.status(200).json({ message: "Itinerary generated successfully", itinerary });

    } catch (error) {
        console.error("❌ Error generating itinerary:", error);
        res.status(500).json({ message: "Error generating itinerary", error });
    }
};

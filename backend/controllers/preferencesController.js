const UserPreferences = require("../models/UserPreferences");
require("dotenv").config();
const fetch = require("node-fetch");

/**
 * Save or update user preferences in the database.
 */
exports.savePreferences = async (req, res) => {
    try {
        const { userId, interests, duration, startDate, location, selectedPlaces,transportMedium} = req.body;
        
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
            preferences.transportMedium = transportMedium;
        } else {
            preferences = new UserPreferences({
                userId,
                interests,
                duration,
                startDate,
                location,
                selectedPlaces,
                transportMedium,
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

        const userPrompt = `
Generate 3 different detailed travel itineraries for a trip to ${preferences.location}, starting on ${new Date(preferences.startDate).toDateString()}, for ${preferences.duration} days. Each itinerary should be unique, offering varied combinations of tourist places, timings, and recommendations.

**User Preferences:**
- Interests: ${preferences.interests.join(", ")}
- Selected Tourist Places:
${preferences.selectedPlaces.length > 0 
  ? preferences.selectedPlaces.map((place, index) => `   ${index + 1}. ${place.name}`).join("\n") 
  : "   No specific places selected, please suggest based on interests."}
- Preferred Transport: ${preferences.transportMedium}
### **User Note:**
- [Summary of key travel tips, advice, and additional notes specific to this trip.( Give point wise summary)]
- [Include any specific cultural or food recommendations based on the user's interests]

### **Itinerary Details**:
Please create a day-wise itinerary for ${preferences.duration} days.

- **Day 1:**
   - [Place Name]: [Brief Description]
   - [Suggested Time Slot] for visiting
   - Travel time between places: [Calculated travel time using ${preferences.transportMedium}]
   - Recommendations: [Cultural or food tips, entry fees, opening hours, etc.]
   - Notes: [Important reminders for the day, safety tips, best time to visit, etc.]

- **Day 2:**
   - [Place Name]: [Brief Description]
   - [Suggested Time Slot] for visiting
   - Travel time between places: [Calculated travel time using ${preferences.transportMedium}]
   - Recommendations: [Cultural or food tips, entry fees, opening hours, etc.]
   - Notes: [Important reminders for the day, safety tips, best time to visit, etc.]

- **Day 3:**
   - [Place Name]: [Brief Description]
   - [Suggested Time Slot] for visiting
   - Travel time between places: [Calculated travel time using ${preferences.transportMedium}]
   - Recommendations: [Cultural or food tips, entry fees, opening hours, etc.]
   - Notes: [Important reminders for the day, safety tips, best time to visit, etc.]

... (Repeat the above structure for the remaining days)

Please ensure that the itinerary is organized clearly, using appropriate headings, bullet points, and formatting. 
The response should be user-friendly and easy to read.
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

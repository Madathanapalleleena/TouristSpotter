const { GoogleGenerativeAI } = require("@google/generative-ai");

// Ensure API key is loaded correctly
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateItinerary(prompt) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);

        // ✅ Log the full API response to debug
        console.log("🔍 Gemini API Raw Response:", JSON.stringify(result, null, 2));

        // ✅ Check if response contains valid text
        if (!result || !result.response || !result.response.text) {
            console.error("❌ No itinerary text generated.");
            return "No itinerary generated.";
        }

        return result.response.text();
    } catch (error) {
        console.error("❌ Error generating itinerary:", error);
        return "Error generating itinerary.";
    }
}

module.exports = { generateItinerary };


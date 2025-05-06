const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
require("dotenv").config(); // Load .env variables

const allowedTopics = [
  "tripgenie", "trip genie", "travel", "vacation", "holiday", "tour",
  "plan", "planner", "itinerary", "personalized itinerary", "custom trip",
  "budget", "budget estimation", "cost", "estimate", "money", "expenses",
  "destination", "place", "places to visit", "popular places", "tourist spot", "tourist attraction",
  "india", "indian tourism", "temple", "hill station", "beach", "historical",
  "cultural", "wildlife", "adventure", "museum", "monument",
  "categories", "category", "select categories", "filters", "filter by days", "number of days",
  "transport", "transportation", "mode of transport", "bus", "car", "train", "flight",
  "location", "current location", "starting location", "start point",
  "date", "start date", "travel date",
  "map", "interactive map", "markers", "color-coded markers", "symbol", "icon",
  "weather", "forecast", "temperature", "weather filter", "climate",
  "hover", "description", "pictures", "images",
  "wikipedia", "wiki", "info", "details",
  "google maps", "map direction", "map view", "route",
  "confirmation", "confirm trip", "accept", "reject",
  "chatbot", "assistant", "ai guide", "genai", "gemini", "tour guide",
  "recommendation", "suggestion", "suggest", "generate travel plan", "custom plan",
  "user preferences", "interests", "select preferences", "customized suggestions"
];

// Changed route to just "/" so it works as /api/chat
router.post("/", async (req, res) => {
  const { message } = req.body;

  const isAllowed = allowedTopics.some((topic) =>
    message.toLowerCase().includes(topic)
  );
  
  if (!isAllowed) {
    return res.json({
      reply: "I can only help with travel-related queries for now. Please ask something about planning trips!",
    });
  }
  
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      const reply = data.candidates[0].content.parts[0].text;
      res.json({ reply });
    } else {
      res.status(500).json({ error: "Invalid response from Gemini API", data });
    }

  } catch (error) {
    console.error("Gemini API error:", error);
  
    // Try logging the response to debug further
    if (error.response) {
      const errorBody = await error.response.text();
      console.error("Gemini API response error body:", errorBody);
    }
  
    res.status(500).json({ error: "Something went wrong while connecting to Gemini API", details: error.message });
  }
  
});

module.exports = router;

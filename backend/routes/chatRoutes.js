const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
require("dotenv").config(); // Load .env variables

// Changed route to just "/" so it works as /api/chat
router.post("/", async (req, res) => {
  const { message } = req.body;

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

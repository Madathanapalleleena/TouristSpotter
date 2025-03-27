import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
const API_KEY = process.env.GEMINI_API_KEY;

router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(`${GEMINI_API_URL}?key=${API_KEY}`, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error calling Gemini API:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch response from Gemini API" });
  }
});

export default router;

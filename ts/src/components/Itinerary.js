import React, { useEffect, useState } from "react";
import { fetchGeminiResponse } from "../services/geminiService"; // Import AI service
import "../styles/Itinerary.css";

const Itinerary = ({ userId }) => {
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        // First, try fetching from the backend
        const response = await fetch(
          `http://localhost:5000/api/itinerary/generate-itinerary/${userId}`
        );
        const data = await response.json();

        if (data.success && data.itinerary) {
          setItinerary(data.itinerary); // Use backend response
        } else {
          console.warn("No itinerary found in DB. Fetching from Gemini...");
          const aiResponse = await fetchGeminiResponse(
            "Suggest a 3-day itinerary for a tourist in India."
          );
          setItinerary(aiResponse?.candidates?.[0]?.content || "No AI response.");
        }
      } catch (error) {
        setError("Error fetching itinerary.");
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [userId]);

  return (
    <div className="itinerary-container">
      <h2>Your Personalized Travel Plan</h2>
      {loading && <p>Loading itinerary...</p>}
      {error && <p className="error-text">{error}</p>}
      {itinerary && (
        <div id="itinerary-details">
          {itinerary.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Itinerary;

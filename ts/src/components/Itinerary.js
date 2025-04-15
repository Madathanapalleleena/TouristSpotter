import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchGeminiResponse } from "../services/geminiService";
import { marked } from "marked";
import "../styles/Itinerary.css";

const Itinerary = () => {
  const location = useLocation();
  const userId = location.state?.userId || localStorage.getItem("userId");
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        if (!userId) {
          setError("User ID not found.");
          return;
        }
  
        const response = await fetch(
          `http://localhost:5000/api/preferences/generate-itinerary/${userId}`
        );
        const data = await response.json();
  
        if (data.itinerary) {
          // Split using "Itinerary <number>:" pattern, but only from the first match onward
          const match = data.itinerary.match(/Itinerary\s*\d+:/i);
          if (!match) {
            setError("No itineraries found.");
            return;
          }
  
          const indexOfFirstItinerary = data.itinerary.indexOf(match[0]);
          const preText = data.itinerary.slice(0, indexOfFirstItinerary).trim();
          const rest = data.itinerary.slice(indexOfFirstItinerary);
  
          const splitItineraries = rest
            .split(/Itinerary\s*\d+:/gi)
            .map((item) => item.trim())
            .filter((item) => item.length > 0);
  
          const formatted = splitItineraries.map(
            (item, idx) => marked(`### Itinerary ${idx + 1}\n\n${item}`)
          );
  
          // Add the header text separately, not as an itinerary
          if (preText) {
            formatted.unshift(marked(preText));
          }
  
          setItineraries(formatted);
          setError("");
        } else {
          setError("No itinerary found.");
        }
      } catch (error) {
        console.error("Error fetching itinerary:", error);
        setError("Error fetching itinerary.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchItinerary();
  }, [userId]);
  

  return (
    <div className="itinerary-container">
      <h1 className="page-heading">Your Personalized Travel Plan</h1>

      {loading && (
  <div className="loading-container">
    <p className="loading-text">Loading itinerary, please wait...</p>
  </div>
)}
      {error && <p className="error-text">{error}</p>}

      <div className="itinerary-list">
        {itineraries.map((itinerary, index) => (
          <div
            key={index}
            className="itinerary-card"
            dangerouslySetInnerHTML={{ __html: itinerary }}
          />
        ))}
      </div>
    </div>
  );
};

export default Itinerary;

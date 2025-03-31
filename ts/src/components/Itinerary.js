import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchGeminiResponse } from "../services/geminiService";
import { marked } from "marked"; // ✅ Import Markdown parser
import "../styles/Itinerary.css";

const Itinerary = () => {
  const location = useLocation();
  const userId = location.state?.userId || localStorage.getItem("userId");
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        if (!userId) {
          setError("User ID not found.");
          return;
        }

        console.log("Fetching itinerary for userId:", userId);

        const response = await fetch(
          `http://localhost:5000/api/preferences/generate-itinerary/${userId}`
        );
        const data = await response.json();
        console.log("API Response:", data); // ✅ Debugging step

        if (data.itinerary) {
          setItinerary(marked(data.itinerary)); // ✅ Convert Markdown to HTML
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
      <h2>Your Personalized Travel Plan</h2>
      {loading && <p>Loading itinerary...</p>}
      {error && <p className="error-text">{error}</p>}

      {itinerary ? (
        <div id="itinerary-details" dangerouslySetInnerHTML={{ __html: itinerary }} />
      ) : (
        <p>No itinerary found.</p>
      )}
    </div>
  );
};

export default Itinerary;


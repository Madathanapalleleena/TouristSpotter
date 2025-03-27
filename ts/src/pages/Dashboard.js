import React, { useEffect, useState } from "react";
import { getUserPreferences, generateItinerary } from "../utils/api";

const Dashboard = () => {
  const [preferences, setPreferences] = useState(null);
  const [itinerary, setItinerary] = useState("");

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const data = await getUserPreferences("YOUR_USER_ID");
        setPreferences(data);
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    };
    fetchPreferences();
  }, []);

  const handleGenerateItinerary = async () => {
    try {
      const data = await generateItinerary("YOUR_USER_ID");
      setItinerary(data.itinerary);
    } catch (error) {
      console.error("Error generating itinerary:", error);
    }
  };

  return (
    <div>
      <h2>User Preferences</h2>
      {preferences ? (
        <div>
          <p><strong>Location:</strong> {preferences.location}</p>
          <p><strong>Duration:</strong> {preferences.duration} days</p>
          <p><strong>Start Date:</strong> {preferences.startDate}</p>
          <p><strong>Interests:</strong> {preferences.interests.join(", ")}</p>
          <button onClick={handleGenerateItinerary}>Generate Itinerary</button>
          {itinerary && <p><strong>AI Itinerary:</strong> {itinerary}</p>}
        </div>
      ) : (
        <p>Loading preferences...</p>
      )}
    </div>
  );
};

export default Dashboard;

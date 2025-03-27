import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MapComponent from "./MapComponent";
import "../styles/Map.css";

const userId = "REPLACE_WITH_LOGGED_IN_USER_ID"; // ✅ Replace dynamically with authenticated user ID

const MapPage = () => {
  const location = useLocation();
  const [userPreferences, setUserPreferences] = useState(() => {
    const storedPreferences = localStorage.getItem("userPreferences");
    return location.state?.preferences ?? (storedPreferences ? JSON.parse(storedPreferences) : null);
  });

  const [selectedPlaces, setSelectedPlaces] = useState([]);

  useEffect(() => {
    console.log("User Preferences from location.state:", location.state);

    if (!userPreferences) {
      fetch(`http://localhost:5000/api/preferences/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched Preferences from Backend:", data);
          if (data) {
            setUserPreferences(data);
            localStorage.setItem("userPreferences", JSON.stringify(data));
          }
        })
        .catch(() => console.error("Failed to fetch preferences"));
    }
  }, [location.state, userPreferences]);

  const handleSavePreferences = async () => {
    if (!userPreferences) {
      alert("No preferences to save!");
      return;
    }

    const preferencesToSave = {
      ...userPreferences,
      selectedPlaces,
    };

    try {
      const response = await fetch("http://localhost:5000/api/preferences/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...preferencesToSave }),
      });

      if (response.ok) {
        alert("Preferences saved successfully!");
        localStorage.setItem("userPreferences", JSON.stringify(preferencesToSave));
      } else {
        throw new Error("Failed to save preferences");
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Error saving preferences. Please try again.");
    }
  };

  return (
    <div className="map-container">
      <h2>Explore Your Personalized Travel Map</h2>

      <div className="travel-details">
        <p><strong>Interests:</strong> {userPreferences?.interests?.join(", ") || "Not selected"}</p>
        <p><strong>Duration:</strong> {userPreferences?.duration || "N/A"} days</p>
        <p><strong>Start Date:</strong> {userPreferences?.startDate || "N/A"}</p>
        <p><strong>Starting Location:</strong> {userPreferences?.location || "N/A"}</p>
      </div>

      <MapComponent 
        userPreferences={userPreferences} 
        onSelectionChange={(selected) => setSelectedPlaces(selected)} // ✅ Store selected places
      />

      <button onClick={handleSavePreferences}>Save Preferences</button>
    </div>
  );
};

export default MapPage;

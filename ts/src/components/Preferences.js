import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { savePreferences } from "../utils/api";
// ✅ Import API function
import "../styles/Preferences.css";

const interests = [
  { name: "Archaeological Sites", img: require("../assets/archaeology.jpg"), desc: "Explore ancient ruins." },
  { name: "Temples", img: require("../assets/temples.jpg"), desc: "Visit grand temples and monasteries." },
  { name: "Coffee Shops", img: require("../assets/coffee.jpg"), desc: "Enjoy cozy cafes and coffee blends." },
  { name: "Hill Stations", img: require("../assets/hill-stations.jpg"), desc: "Escape to cool hill stations." },
  { name: "Beaches", img: require("../assets/beaches.jpg"), desc: "Relax on beautiful beaches." },
  { name: "Wildlife & Safari", img: require("../assets/wildlife.jpg"), desc: "Go on thrilling safaris." },
  { name: "Adventure Sports", img: require("../assets/adventure.jpg"), desc: "Experience extreme sports." },
  { name: "Cultural Experiences", img: require("../assets/culture.jpg"), desc: "Immerse in local cultures." },
  { name: "Weekend Getaways", img: require("../assets/weekend.jpg"), desc: "Recharge with a short trip away from city hustle." },
  { name: "Pilgrimage Spots", img: require("../assets/pilgrimage.jpg"), desc: "Visit sacred places and embark on a spiritual journey." },
  { name: "Foodie Dreams", img: require("../assets/foodie.jpg"), desc: "Taste diverse local and international cuisines." },
  { name: "Trekking Spots", img: require("../assets/trekking.jpg"), desc: "Challenge yourself with scenic trekking trails." },
  { name: "Relaxation Spots", img: require("../assets/relax.jpg"), desc: "Unwind in tranquil resorts and retreats." },
  { name: "Romantic Places", img: require("../assets/romantic.jpg"), desc: "Plan a dreamy getaway with your special someone." }
];

function Preferences({ setUserPreferences }) {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [duration, setDuration] = useState("");
  const [startDate, setStartDate] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  // ✅ Dynamically replace this with actual userId

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleNext = async () => {
    if (!duration || !startDate || !location || selectedInterests.length === 0) {
      alert("Please fill all fields and select at least one interest.");
      return;
    }

    const preferencesData = { 
      userId, 
      interests: selectedInterests, 
      duration, 
      startDate, 
      location, 
      selectedPlaces: [{ name: "Default Location", lat: 0, lon: 0 }]
 // At least send an empty array
    };
    
    console.log("Saving Preferences:", preferencesData); // ✅ Debugging purpose

    try {
      setLoading(true);
      await savePreferences(preferencesData); // ✅ Save to backend
      setUserPreferences(preferencesData);
      navigate("/map", { state: { preferences: preferencesData } }); // ✅ Pass data to map page
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="preferences-container">
      <h2>Select Your Travel Preferences</h2>

      <div className="preferences-grid">
        {interests.map((item) => (
          <div 
            key={item.name} 
            className={`preference-card ${selectedInterests.includes(item.name) ? "selected" : ""}`} 
            onClick={() => toggleInterest(item.name)}
          >
            <img src={item.img} alt={item.name} className="preference-img" />
            <div className="preference-content">
              <h3>{item.name}</h3>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="preferences-form">
        <label>Duration (Days):</label>
        <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />

        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

        <label>Current Location:</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />

        <button className="btn" onClick={handleNext} disabled={loading}>
          {loading ? "Saving..." : "Next"}
        </button>
      </div>
    </div>
  );
}

export default Preferences;

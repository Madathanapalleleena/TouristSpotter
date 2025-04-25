import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { savePreferences } from "../utils/api";
// ✅ Import API function
import "../styles/Preferences.css";

const interests = [
  { name: "Archaeological Sites", img: require("../assets/archaeology.jpg"), desc: "Explore ancient ruins. Walk through historical marvels that whisper stories of the past." },
  { name: "Temples", img: require("../assets/temples.jpg"), desc: "Visit grand temples and monasteries. Feel the spiritual energy and architectural beauty come alive." },
  { name: "Coffee Shops", img: require("../assets/coffee.jpg"), desc: "Enjoy cozy cafes and coffee blends. Perfect spots to unwind or have meaningful conversations." },
  { name: "Hill Stations", img: require("../assets/hill-stations.jpg"), desc: "Escape to cool hill stations. Embrace nature’s calmness in mist-covered peaks and lush greenery." },
  { name: "Beaches", img: require("../assets/beaches.jpg"), desc: "Relax on beautiful beaches. Soak up the sun, listen to the waves, and find your coastal bliss." },
  { name: "Wildlife & Safari", img: require("../assets/wildlife.jpg"), desc: "Go on thrilling safaris. Witness wild animals in their natural habitats and feel the thrill of the jungle." },
  { name: "Adventure Sports", img: require("../assets/adventure.jpg"), desc: "Experience extreme sports. Get your adrenaline rush with bungee jumping, rafting, and more." },
  { name: "Cultural Experiences", img: require("../assets/culture.jpg"), desc: "Immerse in local cultures. Discover traditions, music, art, and heritage that make every place unique." },
  { name: "Weekend Getaways", img: require("../assets/weekend.jpg"), desc: "Recharge with a short trip away from city hustle. Ideal for spontaneous breaks and mini adventures." },
  { name: "Pilgrimage Spots", img: require("../assets/pilgrimage.jpg"), desc: "Visit sacred places and embark on a spiritual journey. Reconnect with your inner self in peaceful surroundings." },
  { name: "Foodie Dreams", img: require("../assets/foodie.jpg"), desc: "Taste diverse local and international cuisines. From street food to fine dining, it's a treat for every palate." },
  { name: "Trekking Spots", img: require("../assets/trekking.jpg"), desc: "Challenge yourself with scenic trekking trails. Perfect for adventure lovers and nature enthusiasts alike." },
  { name: "Relaxation Spots", img: require("../assets/relax.jpg"), desc: "Unwind in tranquil resorts and retreats. Let go of stress and rejuvenate your mind and body." },
  { name: "Romantic Places", img: require("../assets/romantic.jpg"), desc: "Plan a dreamy getaway with your special someone. Create unforgettable memories in enchanting locations." },
  { name: "Nature", img: require("../assets/nature.jpg"), desc: "Breathe in the wild — let nature heal you.Reconnect with nature and explore the scenic beauty of forests, mountains, and rivers." },
  { name: "Entertainment", img: require("../assets/ent.jpg"), desc: "Lights, camera, fun — dive into the world of entertainment! Enjoy theaters, amusement parks, and vibrant entertainment venues." },
  { name: "Camping", img: require("../assets/camp.jpg"), desc: "Camp under the stars — your outdoor escape awaits! Pitch a tent under the stars and enjoy an unforgettable outdoor camping experience." },
  { name: "Sports", img: require("../assets/sport.jpg"), desc: "Get in the game — feel the adrenaline rush! Discover locations for exciting sports, stadiums, and aquatic adventures." }];

function Preferences({ setUserPreferences }) {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [duration, setDuration] = useState("");
  const [startDate, setStartDate] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [transportMedium, setTransportMedium] = useState("");
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

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
      selectedPlaces: [{ name: "Default Location", lat: 0, lon: 0 }],
      transportMedium, 
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
      <p className="subtext">You can select one or more preferences</p>
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
        <label>Preferred Transport Medium:</label>
        <select
        value={transportMedium}
        onChange={(e) => setTransportMedium(e.target.value)}
        className="preferences-select"
>
        <option value="">Select Transport</option>
        <option value="Car">Car</option>
        <option value="Bike">Bike</option>
        <option value="Bus">Bus</option>
        <option value="Train">Train</option>
        <option value="Flight">Flight</option>
        <option value="Cab">Cab</option>
        </select>

        <button className="btn" onClick={handleNext} disabled={loading}>
          {loading ? "Saving..." : "Next"}
        </button>
      </div>
    </div>
  );
}

export default Preferences;

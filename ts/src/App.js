import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Preferences from "./components/Preferences";
import MapPage from "./components/MapPage"; // ✅ Fixed import
import Itinerary from "./components/Itinerary";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./styles/App.css";

function App() {
  const [userPreferences, setUserPreferences] = useState({});

  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/preferences" 
            element={<Preferences setUserPreferences={setUserPreferences} />} 
          />
          <Route 
            path="/map" 
            element={<MapPage userPreferences={userPreferences} />} 
          />
          <Route path="/map/:userId" element={<MapPage userPreferences={userPreferences} />} /> {/* Dynamic User ID */}
          <Route path="/itinerary" element={<Itinerary />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;


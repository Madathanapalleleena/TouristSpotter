import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Preferences from "./components/Preferences";
import MapPage from "./components/MapPage";
import Itinerary from "./components/Itinerary";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/chatbot";
import "./styles/App.css";
import "./styles/ChatbotFloating.css";

function App() {
  const [userPreferences, setUserPreferences] = useState({});
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (isChatOpen) {
      // Play notification sound immediately
      const audio = new Audio("/chat-open.mp3"); // Make sure this file is in your public folder
      audio.play();
  
      // Add a 1-second delay before speaking
      const timeout = setTimeout(() => {
        const greeting = new SpeechSynthesisUtterance("Hi there! How can I help you?");
        speechSynthesis.speak(greeting);
      }, 700); // Delay in milliseconds
  
      // Clear timeout on cleanup
      return () => clearTimeout(timeout);
    }
  }, [isChatOpen]);
  

  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/preferences" element={<Preferences setUserPreferences={setUserPreferences} />} />
          <Route path="/map" element={<MapPage userPreferences={userPreferences} />} />
          <Route path="/map/:userId" element={<MapPage userPreferences={userPreferences} />} />
          <Route path="/itinerary" element={<Itinerary />} />
        </Routes>
      </div>

      {/* Floating Chatbot */}
      <div className="floating-chat-container">
        <button 
          className="floating-chat-button" 
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          💬
        </button>

        {isChatOpen && (
          <div className="floating-chat-popup">
            <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          </div>
        )}
      </div>

      <Footer />
    </Router>
  );
}

export default App;

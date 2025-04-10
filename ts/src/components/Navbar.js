import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaMapMarkedAlt, FaComments } from "react-icons/fa";
import Chatbot from "./chatbot"; // ✅ Make sure this path is correct
import "../styles/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatButtonRef = useRef(null);

  return (
    <nav className="navbar">
      {/* Logo with Travel Icon */}
      <div className="logo">
        <Link to="/">
          <FaMapMarkedAlt className="logo-icon" />
          <span className="highlight">Tourist Spotter</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
        <Link to="/register" className="nav-link" onClick={() => setMenuOpen(false)}>Register</Link>
        <Link to="/preferences" className="nav-link" onClick={() => setMenuOpen(false)}>Preferences</Link>
        <Link to="/map" className="nav-link" onClick={() => setMenuOpen(false)}>Map</Link>
        <Link to="/itinerary" className="nav-link" onClick={() => setMenuOpen(false)}>Itinerary</Link>

        {/* Chatbot Toggle */}
        <div className="chat-wrapper" ref={chatButtonRef}>
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="chat-toggle-btn"
          >
            <FaComments /> Chat
          </button>
          {isChatOpen && (
            <div className="chat-popup">
              <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Icon */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
  );
};

export default Navbar;

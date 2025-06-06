import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaMapMarkedAlt } from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <FaMapMarkedAlt className="logo-icon" />
          <span className="highlight">Tourist Spotter</span>
        </Link>
      </div>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
        <Link to="/register" className="nav-link" onClick={() => setMenuOpen(false)}>Register</Link>
        <Link to="/preferences" className="nav-link" onClick={() => setMenuOpen(false)}>Preferences</Link>
        <Link to="/map" className="nav-link" onClick={() => setMenuOpen(false)}>Map</Link>
        <Link to="/itinerary" className="nav-link" onClick={() => setMenuOpen(false)}>Itinerary</Link>
      </div>

      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
  );
};

export default Navbar;

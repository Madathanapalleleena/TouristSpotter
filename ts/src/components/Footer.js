import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import axios from "axios";
import "../styles/Footer.css";

const Footer = () => {
  const [visitCount, setVisitCount] = useState(null);

  useEffect(() => {
    axios
      .post("http://localhost:5000/api/visit/track", { page: "home" })
      .then((res) => setVisitCount(res.data.count))
      .catch((err) => console.error("Visit tracking failed:", err));
  }, []);

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo & Branding */}
        <div className="footer-brand">
          <h2>Tourist Spotter</h2>
          <p>Your travel companion for discovering the best places.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/preferences">Preferences</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
          </div>

          {/* Moved visit count here */}
          {visitCount !== null && (
            <div className="visit-count-footer">
              👣 Visited {visitCount} times
            </div>
          )}
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>© 2025 Tourist Spotter. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

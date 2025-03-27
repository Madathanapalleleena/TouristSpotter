import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import TravelCarousel from "../components/TravelCarousel"; // Import the new Carousel

const Home = () => {
  return (
    <div className="home-container">
      <header className="header">
        <h1><strong>Plan Your Dream Vacation in India</strong></h1>
        <p>
          <strong>
            Explore breathtaking destinations, customize your itinerary, and embark on an unforgettable journey—all in one place!
          </strong>
        </p>
      </header>

      {/* Travel Image Carousel */}
      <TravelCarousel />

      <div className="home-buttons">
        <Link to="/login" className="btn">Login</Link>
        <Link to="/register" className="btn">Register</Link>
      </div>
    </div>
  );
};

export default Home;

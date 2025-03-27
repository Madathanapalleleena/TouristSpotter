import React from "react";
import "../styles/Home.css";
import TravelCarousel from "./TravelCarousel"; // Background Carousel

const Home = () => {
  return (
    <div className="home-container">
      <TravelCarousel /> {/* Background Carousel */}

      <div className="overlay"></div> {/* Gradient Overlay */}

      <div className="content">
        <header className="header">
          <h1 className="title">
            Explore, Experience & Enjoy <br />
            <span className="highlight">Your Perfect Indian Getaway</span>
          </h1>
          <p className="description">
            Discover breathtaking landscapes, vibrant cultures, and handpicked destinations tailored to your travel style.
          </p>
        </header>
      </div>
    </div>
  );
};

export default Home;






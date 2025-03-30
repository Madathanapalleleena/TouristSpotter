import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import tajMahal from "../assets/tajmahal.jpg";
import gatewayOfIndia from "../assets/gatewayofindia.jpg";
import keralaBackwaters from "../assets/keralabackwaters.jpg";
import goldentemple from "../assets/goldentemple.jpg";
import lighthouse from "../assets/lighthouse.jpg";
import lotustemple from "../assets/lotustemple.jpg";
import redfort from "../assets/redfort.jpg";
import "../styles/TravelCarousel.css";

const TravelCarousel = () => {
  return (
    <div className="carousel-container">
      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        interval={3500}
        showStatus={false}
        showArrows={false}
        transitionTime={1200}
        stopOnHover={false}
      >
        <div className="carousel-slide" key="tajMahal">
          <img src={tajMahal} alt="Taj Mahal, Agra" />
        </div>
        <div className="carousel-slide" key="gatewayOfIndia">
          <img src={gatewayOfIndia} alt="Gateway of India, Mumbai" />
        </div>
        <div className="carousel-slide" key="keralaBackwaters">
          <img src={keralaBackwaters} alt="Kerala Backwaters, Kerala" />
        </div>
        <div className="carousel-slide" key="goldentemple">
          <img src={goldentemple} alt="Golden Temple, Amritsar" />
        </div>
        <div className="carousel-slide" key="lighthouse">
          <img src={lighthouse} alt="Lighthouse, Chennai" />
        </div>
        <div className="carousel-slide" key="redfort">
          <img src={redfort} alt="Red Fort, New Delhi" />
        </div>
        <div className="carousel-slide" key="lotustemple">
          <img src={lotustemple} alt="Lotus Temple, New Delhi" />
        </div>
        
      </Carousel>
    </div>
  );
};

export default TravelCarousel;

import React from "react";
import "./HeroSection.css";
import Search from "./Search";
import Filters from "./Filters";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import FeaturedHotels from "./FeaturedHotels";

function HeroSection() {
  return (
    <div className="hero-image">
      <center>
        <div class="seven" id="animated-text">
          <h1>World Hotels : Explore </h1>
        </div>
      </center>
      <Search />
    </div>
  );
}

export default HeroSection;

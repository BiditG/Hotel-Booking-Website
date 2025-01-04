import React, { useState } from "react";
import "./Rooms.css";

const cities = [
  { name: "Aberdeen", capacity: 90, peakRate: 140, offPeakRate: 70, image: "/Aberdeen.jpg" },
  { name: "Belfast", capacity: 80, peakRate: 130, offPeakRate: 70, image: "/Belfast.jpg" },
  { name: "Birmingham", capacity: 110, peakRate: 150, offPeakRate: 75, image: "/Birmingham.jpg" },
  { name: "Bristol", capacity: 100, peakRate: 140, offPeakRate: 70, image: "/Bristol.jpg" },
  { name: "Cardiff", capacity: 90, peakRate: 130, offPeakRate: 70, image: "/Cardiff.jpg" },
  { name: "Edinburgh", capacity: 120, peakRate: 160, offPeakRate: 80, image: "/Edinburgh.jpg" },
  { name: "Glasgow", capacity: 140, peakRate: 150, offPeakRate: 75, image: "/Glasgow.jpg" },
  { name: "London", capacity: 160, peakRate: 200, offPeakRate: 100, image: "/London.jpg" },
  { name: "Manchester", capacity: 150, peakRate: 180, offPeakRate: 90, image: "/Manchester.jpeg" },
  { name: "Newcastle", capacity: 90, peakRate: 120, offPeakRate: 70, image: "/Newcastle.jpg" },
  { name: "Norwich", capacity: 90, peakRate: 130, offPeakRate: 70, image: "/Norwich.jpg" },
  { name: "Nottingham", capacity: 110, peakRate: 130, offPeakRate: 70, image: "/Nottingham.jpg" },
  { name: "Oxford", capacity: 90, peakRate: 180, offPeakRate: 90, image: "/Oxford.jpg" },
  { name: "Plymouth", capacity: 80, peakRate: 180, offPeakRate: 90, image: "/Plymouth.jpg" },
  { name: "Swansea", capacity: 70, peakRate: 130, offPeakRate: 70, image: "/Swansea.jpg" },
  { name: "Bournemouth", capacity: 90, peakRate: 130, offPeakRate: 70, image: "/Bourne.jpg" },
  { name: "Kent", capacity: null, peakRate: null, offPeakRate: null, image: "/Kent.jpg" },
];

function Rooms() {
  const [searchQuery, setSearchQuery] = useState(""); // State to store the search query

  // Filter cities based on the search query
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="rooms-and-rates" style={{marginTop: '50px'}}>
      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a city..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
        />
      </div>

      <h1 className="heading">Rooms & Rates</h1>
      <div className="cards-container">
        {filteredCities.map((city, index) => (
          <div className="card" key={index}>
            <div className="card-image-container">
              <img src={city.image} alt={city.name} className="card-image" />
            </div>
            <div className="card-content">
              <h2 className="city-name">{city.name}</h2>
              {city.capacity ? (
                <>
                  <p className="capacity">Capacity: {city.capacity} rooms</p>
                  <p className="rates">
                    Peak Rate: <span className="highlight">£{city.peakRate}</span> | Off-Peak Rate:{" "}
                    <span className="highlight">£{city.offPeakRate}</span>
                  </p>
                </>
              ) : (
                <p className="unavailable">Rates and capacity unavailable</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Rooms;

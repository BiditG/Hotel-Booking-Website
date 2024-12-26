import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Correct path for Bootstrap CSS

import "./App.css";
import Navibar from "./Navibar";
import Search from "./Search";
import HeroSection from "./HeroSection";
import FeaturedHotels from "./FeaturedHotels";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import LandingPage from "./LandingPage";
import Register from "./Register";
import Offers from "./Offers";
import Currency from "./Currency";
import Contact from "./Contact";
import Filters from "./Filters";
import Explore from "./Explore";
import SearchResults from "./SearchResults";


function App() {
  const hotels = [
    {
      name: "London Hotels",
      image: "/pexels-pixabay-271619.jpg",
      description: "Some quick example text to build on the card title and make up the bulk of the card's content.",
      rating: "4",
      amenities: "Wifi, Gym",
      price: "$400",
    },
    {
      name: "Paris Hotels",
      image: "/pexels-pixabay-271617.jpg",
      description: "Experience the best of Paris with luxurious stays.",
      rating: "5",
      amenities: "Pool, Spa, Wifi",
      price: "$600",
    },
    {
      name: "New York Hotels",
      image: "/pexels-pixabay-271618.jpg",
      description: "A perfect blend of modern and classic.",
      rating: "4.5",
      amenities: "Gym, Wifi, Bar",
      price: "$500",
    },
    {
      name: "London Hotels",
      image: "/pexels-pixabay-271619.jpg",
      description: "Some quick example text to build on the card title and make up the bulk of the card's content.",
      rating: "4",
      amenities: "Wifi, Gym",
      price: "$400",
    },
    {
      name: "Paris Hotels",
      image: "/pexels-pixabay-271617.jpg",
      description: "Experience the best of Paris with luxurious stays.",
      rating: "5",
      amenities: "Pool, Spa, Wifi",
      price: "$600",
    },
    {
      name: "New York Hotels",
      image: "/pexels-pixabay-271618.jpg",
      description: "A perfect blend of modern and classic.",
      rating: "4.5",
      amenities: "Gym, Wifi, Bar",
      price: "$500",
    },
  ];
  const cities = [
    { name: "Aberdeen", capacity: 90, peakRate: 140, offPeakRate: 70 , image: '/Aberdeen.jpg'},
    { name: "Belfast", capacity: 80, peakRate: 130, offPeakRate: 70 , image: '/Belfast.jpg'},
    { name: "Birmingham", capacity: 110, peakRate: 150, offPeakRate: 75, image: '/Birmingham.jpg' },
    { name: "Bristol", capacity: 100, peakRate: 140, offPeakRate: 70, image: '/Bristol.jpg' },
    { name: "Cardiff", capacity: 90, peakRate: 130, offPeakRate: 70 , image: '/Cardiff.jpg'},
    { name: "Edinburgh", capacity: 120, peakRate: 160, offPeakRate: 80 , image: '/Edinburgh.jpg'},
    { name: "Glasgow", capacity: 140, peakRate: 150, offPeakRate: 75 , image: '/Glasgow.jpg'},
    { name: "London", capacity: 160, peakRate: 200, offPeakRate: 100 , image: '/London.jpg'},
    { name: "Manchester", capacity: 150, peakRate: 180, offPeakRate: 90, image: '/Manchester.jpeg' },
    { name: "Newcastle", capacity: 90, peakRate: 120, offPeakRate: 70, image: '/Newcastle.jpg' },
    { name: "Norwich", capacity: 90, peakRate: 130, offPeakRate: 70 , image: '/Norwich.jpg'},
    { name: "Nottingham", capacity: 110, peakRate: 130, offPeakRate: 70 , image: '/Nottingham.jpg'},
    { name: "Oxford", capacity: 90, peakRate: 180, offPeakRate: 90, image: '/Oxford.jpg' },
    { name: "Plymouth", capacity: 80, peakRate: 180, offPeakRate: 90, image: '/Plymouth.jpg'},
    { name: "Swansea", capacity: 70, peakRate: 130, offPeakRate: 70, image: '/Swansea.jpg' },
    { name: "Bournemouth", capacity: 90, peakRate: 130, offPeakRate: 70 , image: '/Bourne.jpg'},
    { name: "Kent", capacity: null, peakRate: null, offPeakRate: null, image: '/Kent.jpg'}  
  ];
  return (
    <>
      <Router>
        <Navibar />
        <Routes>
        <Route path="/" element={
            <>
              <LandingPage />
              <div className="bothcontainer">
                <FeaturedHotels hotels={hotels} />
              </div>
              <Explore cities={cities}/>
            </>
          }/>
          <Route path="/Login" element={<Login/>}/>
          <Route path="/Register" element={<Register/>}/>
          <Route path="/Offers" element={<Offers/>}/>
          <Route path="/Currency" element={<Currency/>}/>
          <Route path="/Contact" element={<Contact/>}/>
          <Route path="/Search" element={<Search />} />
          <Route path="/SearchResults" element={<SearchResults />} />
        </Routes>
      </Router>

      
    </>
  );
}

export default App;

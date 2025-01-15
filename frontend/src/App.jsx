import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Correct path for Bootstrap CSS
import "./App.css";
import Navibar from "./Navibar";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import LandingPage from "./LandingPage";
import Offers from "./Offers";
import Currency from "./Currency";
import Contact from "./Contact";
import Search from "./Search";
import Explore from "./Explore";
import FeaturedHotels from "./FeaturedHotels";
import SearchResults from "./SearchResults";
import Footer from "./Footer";
import Rooms from "./Rooms";
import CityDetail from "./CityDetail";
import Booking from "./Booking";
import Checkout from "./Checkout";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import RollingGallery from "./RollingGallery";
import Masonry from "./Masonry";
import Adminpanel from "./Adminpanel";
import Book from "./Book";
import Payment from "./Payment";
import Transcript from "./Transcript";
import Cart from "./Cart";
import AdminUser from "./Adminuser";
import Hotelmanagement from "./Hotelmanagement";
import UserCurrencyManagement from "./Usercurrencymanagement";
import TopPayingCustomers from "./toppayingcustomers";
import DashboardAnalytics from "./Dashboardanalytics";
import Usermanagement from "./Usermanagement";
import Updateoffer from "./Updateoffer";
import SearchResults1 from "./searchresults1";

// Custom Hook to conditionally render Navibar based on current location
function Navigation() {
  const location = useLocation(); // Get current location
  return location.pathname !== "/adminpanel" ? <Navibar /> : null; // Render Navibar only when path is not /adminpanel
}

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
  ];

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
    { name: "Kent", capacity: 100, peakRate: 150, offPeakRate: 80, image: "/Kent.jpg" },

  ];
  

  return (
    <Router>
      {/* Render Navibar conditionally based on route */}
      <Navigation />

      {/* Define Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <LandingPage />
              <div className="bothcontainer">
                <FeaturedHotels hotels={hotels} />
              </div>
              <Explore cities={cities} />
            </>
          }
        />
        <Route path="/Offers" element={<Offers />} />
        <Route path="/Rooms" element={<Rooms />} />
        <Route path="/Currency" element={<Currency />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Search" element={<Search />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Booking" element={<Booking />} />
        <Route path="/SearchResults" element={<SearchResults />} />
        <Route path="/city/:cityName" element={<CityDetail />} />
        <Route path="/Checkout" element={<Checkout />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/RollingGallery" element={<RollingGallery />} />
        <Route path="/Masonry" element={<Masonry />} />
        <Route path="/adminpanel" element={<Adminpanel />} />
        <Route path="/Book" element={<Book />} />
        <Route path="/Payment" element={<Payment />} />
        <Route path="/Transcript" element={<Transcript />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/Adminuser" element={<AdminUser />} />
        <Route path="/Hotelmanagement" element={<Hotelmanagement />} />
        <Route path="/UserCurrencyManagement" element={<UserCurrencyManagement />} />
        <Route path="/toppayingcustomers" element={<TopPayingCustomers />} />
        <Route path="/dashboardanalytics" element={<DashboardAnalytics />} />
        <Route path="/Usermanagement" element={<Usermanagement />} />
        <Route path="/Updateoffer" element={<Updateoffer />} />
        <Route path="searchresults1" element={<SearchResults1/>}/>
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;

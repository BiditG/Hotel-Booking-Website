import React from 'react'
import './HeroSection.css'
import Search from './Search'
import Filters from './Filters'
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import FeaturedHotels from './FeaturedHotels';

function HeroSection() {
  return (
    <div className='hero-image'>
        <h1>Nepal's Finest Hotel Booking Site</h1>
        <Search/>
        
    </div>
  )
}

export default HeroSection
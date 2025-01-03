import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaHome, FaConciergeBell, FaTags, FaEnvelope, FaBook, FaUserCircle } from 'react-icons/fa';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { Menu as MenuIcon } from '@mui/icons-material';
import './Navibar.css';

function Navibar() {
  const [anchorEl, setAnchorEl] = useState(null); // For handling account dropdown menu state

  // Open the dropdown menu when account icon is clicked
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the dropdown menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="nav-container fixed-top">
      <Container>
        {/* Logo */}
        <Navbar.Brand as={Link} to="/" className="navbar-logo">
          World Hotels
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto nav-links">
            {/* Home */}
            <Nav.Link as={NavLink} to="/" className="nav-link-item" activeClassName="active">
              <FaHome className="nav-icon" /> Home
            </Nav.Link>

            {/* Rooms */}
            <Nav.Link as={NavLink} to="/rooms" className="nav-link-item" activeClassName="active">
              <FaConciergeBell className="nav-icon" /> Rooms & Rates
            </Nav.Link>

            {/* Offers */}
            <Nav.Link as={NavLink} to="/offers" className="nav-link-item" activeClassName="active">
              <FaTags className="nav-icon" /> Offers
            </Nav.Link>

            {/* Contact */}
            <Nav.Link as={NavLink} to="/contact" className="nav-link-item" activeClassName="active">
              <FaEnvelope className="nav-icon" /> Contact
            </Nav.Link>

            {/* Bookings */}
            <Nav.Link as={NavLink} to="/bookings" className="nav-link-item" activeClassName="active">
              <FaBook className="nav-icon" /> Bookings
            </Nav.Link>

            {/* Account Icon and Dropdown */}
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleMenuOpen}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <FaUserCircle className="nav-icon" />
            </IconButton>

            {/* Account Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              MenuListProps={{
                'aria-labelledby': 'account-menu-button',
              }}
            >
              <MenuItem component={NavLink} to="/Login" onClick={handleMenuClose}>
                Login
              </MenuItem>
              <MenuItem component={NavLink} to="/Register" onClick={handleMenuClose}>
                Register
              </MenuItem>
              <MenuItem component={NavLink} to="/Profile" onClick={handleMenuClose}>
                Profile
              </MenuItem>
            </Menu>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navibar;

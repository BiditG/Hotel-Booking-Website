import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Button, Box, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { Home, Hotel, LocalOffer, MailOutline, Book, AccountCircle, Menu as MenuIcon } from '@mui/icons-material';
import './Navibar.css';

function Navibar() {
  const [anchorEl, setAnchorEl] = useState(null); // For handling account dropdown menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null); // For mobile menu state

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Open the dropdown menu when account icon is clicked
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the dropdown menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Open the mobile menu
  const handleMobileMenuOpen = (event) => {
    setMobileMenuOpen(event.currentTarget);
  };

  // Close the mobile menu
  const handleMobileMenuClose = () => {
    setMobileMenuOpen(null);
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: <Home />, info: 'Return to the homepage with an overview of our offerings.' },
    { to: '/rooms', label: 'Rooms & Rates', icon: <Hotel />, info: 'Browse our selection of luxurious rooms and competitive rates.' },
    { to: '/offers', label: 'Offers', icon: <LocalOffer />, info: 'Check out our exclusive deals and discounts for your stay.' },
    { to: '/contact', label: 'Contact', icon: <MailOutline />, info: 'Get in touch with us for any inquiries or support.' },
    { to: '/cart', label: 'Bookings', icon: <Book />, info: 'Manage and view your existing bookings.' },
  ];

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#1d58a2', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            color: '#fff',
            fontWeight: 'bold',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          🌍 World Hotels
        </Typography>

        {isMobile ? (
          <>
            {/* Mobile Menu Icon */}
            <IconButton onClick={handleMobileMenuOpen} sx={{ color: '#fff' }}>
              <MenuIcon sx={{ transform: mobileMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'all 0.3s ease' }} />
            </IconButton>
            <Menu
              anchorEl={mobileMenuOpen}
              open={Boolean(mobileMenuOpen)}
              onClose={handleMobileMenuClose}
              MenuListProps={{
                'aria-labelledby': 'mobile-menu-button',
                sx: { backgroundColor: '#fff', color: '#333' },
              }}
            >
              {navLinks.map((link) => (
                <MenuItem
                  key={link.label}
                  component={NavLink}
                  to={link.to}
                  onClick={handleMobileMenuClose}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#155a8a',
                      color: 'gold',
                    },
                  }}
                >
                  {link.icon} {link.label}
                </MenuItem>
              ))}
              <MenuItem onClick={handleMenuOpen} sx={{
                '&:hover': {
                  backgroundColor: '#155a8a',
                  color: 'gold',
                },
              }}>
                <AccountCircle /> Account
              </MenuItem>
            </Menu>

            {/* Account Dropdown for Mobile */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              MenuListProps={{
                'aria-labelledby': 'account-menu-button',
                sx: { backgroundColor: '#fff', color: '#333' },
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
          </>
        ) : (
          /* Desktop Navigation */
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {navLinks.map((link) => (
              <Tooltip key={link.label} title={<Typography sx={{ fontSize: '14px', fontFamily: 'Poppins, sans-serif' }}>{link.info}</Typography>} arrow>
                <Button
                  component={NavLink}
                  to={link.to}
                  sx={{
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    fontFamily: 'Poppins, sans-serif',
                    '&:hover': {
                      backgroundColor: '#155a8a',
                      transform: 'scale(1.1)',
                      color: 'gold',
                    },
                    transition: 'all 0.3s ease',
                  }}
                  startIcon={link.icon}
                >
                  {link.label}
                </Button>
              </Tooltip>
            ))}

            {/* Account Icon and Dropdown */}
            <Tooltip title={<Typography sx={{ fontSize: '14px', fontFamily: 'Poppins, sans-serif' }}>Account Options</Typography>}>
              <IconButton onClick={handleMenuOpen} sx={{ color: '#fff', '&:hover': { color: 'gold' }, transition: 'all 0.3s ease' }}>
                <AccountCircle fontSize="large" />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              MenuListProps={{
                'aria-labelledby': 'account-menu-button',
                sx: { backgroundColor: '#fff', color: '#333' },
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
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navibar;

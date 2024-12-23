import { Link, NavLink } from 'react-router-dom';
import { FaHome, FaConciergeBell, FaTags, FaEnvelope, FaBook, FaUserCircle } from 'react-icons/fa'; // Icons
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './Navibar.css';

function Navibar() {
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
            <div className="nav-item-container">
              <Nav.Link as={NavLink} to="/" className="nav-link-item" activeClassName="active-link">
                <FaHome className="nav-icon" /> Home
              </Nav.Link>
              <div className="nav-description">Discover our homepage.</div>
            </div>

            {/* Rooms */}
            <div className="nav-item-container">
              <Nav.Link as={NavLink} to="/rooms" className="nav-link-item" activeClassName="active-link">
                <FaConciergeBell className="nav-icon" /> Rooms & Rates
              </Nav.Link>
              <div className="nav-description">Explore luxury and comfort.</div>
            </div>

            {/* Offers */}
            <div className="nav-item-container">
              <Nav.Link as={NavLink} to="/offers" className="nav-link-item" activeClassName="active-link">
                <FaTags className="nav-icon" /> Offers
              </Nav.Link>
              <div className="nav-description">Special deals and packages.</div>
            </div>

            {/* Contact */}
            <div className="nav-item-container">
              <Nav.Link as={NavLink} to="/contact" className="nav-link-item" activeClassName="active-link">
                <FaEnvelope className="nav-icon" /> Contact
              </Nav.Link>
              <div className="nav-description">Get in touch with us.</div>
            </div>

            {/* Bookings */}
            <div className="nav-item-container">
              <Nav.Link as={NavLink} to="/bookings" className="nav-link-item" activeClassName="active-link">
                <FaBook className="nav-icon" /> Bookings
              </Nav.Link>
              <div className="nav-description">Make your reservations now.</div>
            </div>

            {/* Account Dropdown */}
            <NavDropdown
              title={
                <span className="nav-link-item">
                  <FaUserCircle className="nav-icon" /> Account
                </span>
              }
              id="collapsible-nav-dropdown"
              className="account-dropdown"
            >
              <NavDropdown.Item as={Link} to="/login">Login</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/register">Register</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#">Profile</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navibar;

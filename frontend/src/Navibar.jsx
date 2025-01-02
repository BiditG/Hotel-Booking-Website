import { Link, NavLink } from 'react-router-dom';
import { FaHome, FaConciergeBell, FaTags, FaEnvelope, FaBook, FaUserCircle } from 'react-icons/fa';
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

            {/* Account Dropdown */}
            <NavDropdown
              title={<span className="nav-link-item"><FaUserCircle className="nav-icon" /> Account</span>}
              id="collapsible-nav-dropdown"
              className="account-dropdown"
            >
              <NavDropdown.Item as={NavLink} to="/Login">Login</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/Register">Register</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={NavLink} to="/Profile">Profile</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navibar;

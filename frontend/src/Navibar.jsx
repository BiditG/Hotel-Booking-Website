import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom'; // For active navigation
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './Navibar.css';
import Offers from './Offers';
import Currency from './Currency';
import Contact from './Contact';

function Navibar() {
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary shadow fixed-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand">World Hotels</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto" id="nav">
            <Nav.Link as={NavLink} to="/" className="link" activeClassName="active" style={{color: 'white',}}>Home</Nav.Link>
            <Nav.Link className="link">Rooms/Rates</Nav.Link>
            <Nav.Link as={NavLink} to="/Offers" className="link" activeClassName="active"style={{color: 'white',}}>Offers</Nav.Link>
            <Nav.Link as={NavLink} to="/Contact" className="link" activeClassName="active"style={{color: 'white',}}>Contact</Nav.Link>
            <Nav.Link as={NavLink} to="/Bookings" className="link" activeClassName="active"style={{color: 'white',}}>Bookings</Nav.Link>

            <NavDropdown title="Account" id="collapsible-nav-dropdown" className="navdrop">
              <NavDropdown.Item as={Link} to="/Login">Login</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/Register">Register</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navibar;

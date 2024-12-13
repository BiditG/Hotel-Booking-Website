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
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary shadow fixed-top" >
      <Container>
        <Navbar.Brand href="#home">World Hotels</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto" id='nav'>
            
            <Nav.Link as={Link} to="/" className='link'>Home</Nav.Link>
            <Nav.Link  className='link'>Rooms/Rates</Nav.Link>
            <Nav.Link as={Link} to='./Offers'className='link'>Offers</Nav.Link> 
            <Nav.Link  as = {Link} to='./Contact' className='link'>Contact </Nav.Link>
            <Nav.Link  as = {Link} to='/' className='link'>Bookings </Nav.Link> 
            
            
            <NavDropdown title="Account" id="collapsible-nav-dropdown"className='navdrop'>
  
              
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



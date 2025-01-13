import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form, Navbar, Nav, Offcanvas, Stack, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Hotelmanagement from './Hotelmanagement';
import UserCurrencyManagement from './Usercurrencymanagement';
import DashboardAnalytics from './Dashboardanalytics';
import Usermanagement from './Usermanagement';
import Updateoffer from './Updateoffer';
import './Adminpanel.css'; // External CSS file for styling

const Adminpanel = () => {
  const [hotels, setHotels] = useState([]);
  const [users, setUsers] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [newHotel, setNewHotel] = useState({
    name: '',
    description: '',
    image: '',
    amenities: '',
    rating: '',
    price: '',
    city: '',
    room_capacity: '',
    standard_rate_peak: '',
    standard_rate_off_peak: '',
    status: 'available',
  });
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);

  const navigate = useNavigate();

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin/hotels', { withCredentials: true });
      setHotels(response.data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users', { withCredentials: true });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrencies = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/currencies', { withCredentials: true });
      setCurrencies(response.data);
    } catch (error) {
      console.error('Error fetching currencies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
    fetchUsers();
    fetchCurrencies();
  }, []);

  const handleChange = (e) => {
    setNewHotel({
      ...newHotel,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddHotel = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/admin/hotels', newHotel, { withCredentials: true });
      fetchHotels();
      setNewHotel({
        name: '',
        description: '',
        image: '',
        amenities: '',
        rating: '',
        price: '',
        city: '',
        room_capacity: '',
        standard_rate_peak: '',
        standard_rate_off_peak: '',
        status: 'available',
      });
    } catch (error) {
      console.error('Error adding hotel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExit = () => {
    navigate('/'); // Navigating to the home page (replace '/' with your desired path)
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar bg="primary" variant="dark" expand="lg" className="sticky-top shadow-sm">
        <Navbar.Brand href="#" className="text-white">
          <strong>Admin Panel</strong>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ml-auto">
            <Button variant="outline-light" onClick={handleExit}>
              Exit Admin Panel
            </Button>
          </Nav>
        </Navbar.Collapse>

        {/* Add Menu Button for Larger Screens */}
        <Button
          className="d-none d-lg-block ms-auto me-3"
          variant="outline-light"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <i className="bi bi-list"></i> Menu
        </Button>
      </Navbar>

      <Container fluid>
        <Row>
          {/* Sidebar */}
          <Col xs={12} md={3} lg={2} className="p-0">
            <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} className="custom-offcanvas">
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Admin Panel</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Stack gap={2}>
                  <Button
                    variant={selectedTab === 0 ? 'outline-primary active' : 'outline-primary'}
                    onClick={() => setSelectedTab(0)}
                  >
                    Hotels
                  </Button>
                  <Button
                    variant={selectedTab === 1 ? 'outline-primary active' : 'outline-primary'}
                    onClick={() => setSelectedTab(1)}
                  >
                    Add Hotel
                  </Button>
                  <Button
                    variant={selectedTab === 2 ? 'outline-primary active' : 'outline-primary'}
                    onClick={() => setSelectedTab(2)}
                  >
                    Users
                  </Button>
                  <Button
                    variant={selectedTab === 3 ? 'outline-primary active' : 'outline-primary'}
                    onClick={() => setSelectedTab(3)}
                  >
                    Currency Exchange
                  </Button>
                  <Button
                    variant={selectedTab === 4 ? 'outline-primary active' : 'outline-primary'}
                    onClick={() => setSelectedTab(4)}
                  >
                    Financial Analytics
                  </Button>
                  <Button
                    variant={selectedTab === 5 ? 'outline-primary active' : 'outline-primary'}
                    onClick={() => setSelectedTab(5)}
                  >
                    Offer Management
                  </Button>
                </Stack>
              </Offcanvas.Body>
            </Offcanvas>

            {/* For mobile devices */}
            <Button className="d-lg-none" variant="primary" onClick={() => setShowSidebar(true)}>
              <i className="bi bi-list"></i> Menu
            </Button>
          </Col>

          {/* Main Content */}
          <Col xs={12} md={9} lg={10}>
            <div className="p-4">
              {loading ? (
                <div className="d-flex justify-content-center align-items-center">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <>
                  <h2 className="mb-4 text-primary">
                    {selectedTab === 0 && 'Hotels'}
                    {selectedTab === 1 && 'Add New Hotel'}
                    {selectedTab === 2 && 'Users'}
                    {selectedTab === 3 && 'Currency Exchange'}
                    {selectedTab === 4 && 'Financial Analytics'}
                    {selectedTab === 5 && 'Offer Management'}
                  </h2>

                  {selectedTab === 0 && <Hotelmanagement />}
                  {selectedTab === 1 && (
                    <Card className="custom-card">
                      <Card.Body>
                        <Card.Title className="text-primary">🌟 Add New Hotel 🌟</Card.Title>
                        <Form onSubmit={handleAddHotel}>
                          <Row>
                            {Object.keys(newHotel).map((key) => (
                              key !== 'status' && (
                                <Col xs={12} sm={6} key={key}>
                                  <Form.Group controlId={key}>
                                    <Form.Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name={key}
                                      value={newHotel[key]}
                                      onChange={handleChange}
                                      required
                                    />
                                  </Form.Group>
                                </Col>
                              )
                            ))}
                          </Row>
                          <Button variant="primary" type="submit" className="mt-3">
                            Add Hotel
                          </Button>
                        </Form>
                      </Card.Body>
                    </Card>
                  )}
                  {selectedTab === 2 && <Usermanagement />}
                  {selectedTab === 3 && <UserCurrencyManagement />}
                  {selectedTab === 4 && <DashboardAnalytics />}
                  {selectedTab === 5 && <Updateoffer />}
                </>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Adminpanel;


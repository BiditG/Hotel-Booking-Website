import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { EmojiEvents, Hotel, AccountCircle } from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const DashboardAnalytics = () => {
  const [data, setData] = useState(null);

  // Fetch data from the backend API when the component is mounted
  useEffect(() => {
    fetch('http://localhost:5000/api/admin/dashboard', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(result => {
        setData(result);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  const { total_sales, users, hotels } = data;

  const formatAmount = (amount) => {
    const amountAsNumber = parseFloat(amount);
    return !isNaN(amountAsNumber) ? amountAsNumber.toFixed(2) : '0.00';
  };

  const totalSalesFormatted = formatAmount(total_sales);

  // Pie chart data (total sales for users and hotels)
  const pieChartData = [
    { name: 'Users', value: users.reduce((sum, user) => sum + parseFloat(user.total_amount), 0) },
    { name: 'Hotels', value: hotels.reduce((sum, hotel) => sum + parseFloat(hotel.total_amount), 0) },
  ];

  // Sales over time data (for the line chart)
  const salesOverTime = [
    { date: '2025-01-01', sales: 1200 },
    { date: '2025-01-02', sales: 1500 },
    { date: '2025-01-03', sales: 1800 },
    { date: '2025-01-04', sales: 2000 },
    { date: '2025-01-05', sales: 2200 },
  ];

  return (
    <Container className="mt-4">
      {/* Title Section */}
      <Row className="text-center mb-4">
        <Col>
          <h2><EmojiEvents fontSize="large" /> Dashboard Analytics <EmojiEvents fontSize="large" /></h2>
          <Badge pill bg="primary">Stay on top of your performance!</Badge>
        </Col>
      </Row>

      {/* Total Sales Card */}
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={4}>
          <Card className="shadow-sm rounded bg-success text-white">
            <Card.Body>
              <Card.Title>💰 Total Sales: ${totalSalesFormatted}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Pie Chart for Sales Distribution */}
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={6}>
          <Card className="shadow-sm rounded">
            <Card.Body>
              <Card.Title><EmojiEvents fontSize="small" /> Sales Distribution</Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    label
                  >
                    <Cell fill="#8884d8" />
                    <Cell fill="#82ca9d" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Line Chart for Sales Over Time */}
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={8}>
          <Card className="shadow-sm rounded">
            <Card.Body>
              <Card.Title>💸 Sales Over Time</Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Users and Hotels Section */}
      <Row className="justify-content-center mb-4">
        {/* Users Table */}
        <Col xs={12} md={5}>
          <Card className="shadow-sm rounded">
            <Card.Body>
              <Card.Title><AccountCircle fontSize="small" /> Users (Highest Amount Paid)</Card.Title>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th className="text-right">Total Amount Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index}>
                      <td>{user.username}</td>
                      <td className="text-right">${formatAmount(user.total_amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Hotels Table */}
        <Col xs={12} md={5}>
          <Card className="shadow-sm rounded">
            <Card.Body>
              <Card.Title><Hotel fontSize="small" /> Hotels (Highest Amount Received)</Card.Title>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Hotel Name</th>
                    <th className="text-right">Total Amount Received</th>
                  </tr>
                </thead>
                <tbody>
                  {hotels.map((hotel, index) => (
                    <tr key={index}>
                      <td>{hotel.hotel_name}</td>
                      <td className="text-right">${formatAmount(hotel.total_amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Fun Chip Section */}
      <Row className="text-center mt-4">
        <Col>
          <Badge pill bg="success">Keep up the great work!</Badge>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardAnalytics;

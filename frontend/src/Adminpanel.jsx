import React from 'react'

function Adminpanel() {
  return (
    
<>
  {/* Sidebar */}
  <div className="sidebar">
    <div className="sidebar-header">
      <h2>Admin Panel</h2>
    </div>
    <ul className="sidebar-menu">
      <li>
        <a href="#">Dashboard</a>
      </li>
      <li>
        <a href="#">Manage Hotels</a>
      </li>
      <li>
        <a href="#">Manage Rooms</a>
      </li>
      <li>
        <a href="#">Reports</a>
      </li>
      <li>
        <a href="#">Change Password</a>
      </li>
      <li>
        <a href="#">Logout</a>
      </li>
    </ul>
  </div>
  {/* Main Content */}
  <div className="main-content">
    <header>
      <div className="header-content">
        <h1>Welcome to Admin Panel</h1>
        <button className="logout-btn">Logout</button>
      </div>
    </header>
    {/* Dashboard */}
    <div className="dashboard-cards">
      <div className="card">
        <h3>Total Hotels</h3>
        <p>15</p>
      </div>
      <div className="card">
        <h3>Total Rooms</h3>
        <p>120</p>
      </div>
      <div className="card">
        <h3>Total Sales</h3>
        <p>$15,000</p>
      </div>
      <div className="card">
        <h3>Active Users</h3>
        <p>50</p>
      </div>
    </div>
    {/* Action Buttons */}
    <div className="action-buttons">
      <button className="action-btn">Add Hotel</button>
      <button className="action-btn">Generate Report</button>
    </div>
    {/* Recent Activity */}
    <div className="recent-activity">
      <h2>Recent Activities</h2>
      <table>
        <thead>
          <tr>
            <th>Activity</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Hotel "Luxury Inn" added</td>
            <td>2024-12-28</td>
          </tr>
          <tr>
            <td>Room "101" updated</td>
            <td>2024-12-27</td>
          </tr>
          <tr>
            <td>New report generated</td>
            <td>2024-12-26</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</>

  )
}

export default Adminpanel
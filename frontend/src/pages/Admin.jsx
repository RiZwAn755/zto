import React, { useState } from 'react';
import './Admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock data for demonstration
  const stats = {
    totalUsers: 1247,
    totalExams: 89,
    activeExams: 12,
    totalRevenue: 45600
  };



  const recentUsers = [
    { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', joinDate: '2024-01-10', status: 'Active' },
    { id: 2, name: 'Priya Patel', email: 'priya@example.com', joinDate: '2024-01-12', status: 'Active' },
    { id: 3, name: 'Amit Kumar', email: 'amit@example.com', joinDate: '2024-01-15', status: 'Inactive' },
    { id: 4, name: 'Neha Singh', email: 'neha@example.com', joinDate: '2024-01-18', status: 'Active' }
  ];

  const renderDashboard = () => (
    <div className="admin-dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalUsers.toLocaleString()}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon exams-icon">📝</div>
          <div className="stat-content">
            <h3>{stats.totalExams}</h3>
            <p>Total Exams</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon active-icon">🔥</div>
          <div className="stat-content">
            <h3>{stats.activeExams}</h3>
            <p>Active Exams</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon revenue-icon">💰</div>
          <div className="stat-content">
            <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <h3>Recent Exams</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Exam Name</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Participants</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentExams.map(exam => (
                  <tr key={exam.id}>
                    <td>{exam.name}</td>
                    <td>{exam.date}</td>
                    <td>
                      <span className={`status-badge ${exam.status.toLowerCase()}`}>
                        {exam.status}
                      </span>
                    </td>
                    <td>{exam.participants}</td>
                    <td>
                      <button className="action-btn edit">Edit</button>
                      <button className="action-btn delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="content-section">
          <h3>Recent Users</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Join Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.joinDate}</td>
                    <td>
                      <span className={`status-badge ${user.status.toLowerCase()}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <button className="action-btn view">View</button>
                      <button className="action-btn edit">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExams = () => (
    <div className="admin-exams">
      <div className="section-header">
        <h2>Exam Management</h2>
        <button className="add-btn">+ Add New Exam</button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Exam Name</th>
              <th>Category</th>
              <th>Date</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentExams.map(exam => (
              <tr key={exam.id}>
                <td>#{exam.id}</td>
                <td>{exam.name}</td>
                <td>Engineering</td>
                <td>{exam.date}</td>
                <td>3 hours</td>
                <td>₹500</td>
                <td>
                  <span className={`status-badge ${exam.status.toLowerCase()}`}>
                    {exam.status}
                  </span>
                </td>
                <td>
                  <button className="action-btn view">View</button>
                  <button className="action-btn edit">Edit</button>
                  <button className="action-btn delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="admin-users">
      <div className="section-header">
        <h2>User Management</h2>
        <button className="add-btn">+ Add New User</button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Join Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentUsers.map(user => (
              <tr key={user.id}>
                <td>#{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>+91 98765 43210</td>
                <td>{user.joinDate}</td>
                <td>
                  <span className={`status-badge ${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <button className="action-btn view">View</button>
                  <button className="action-btn edit">Edit</button>
                  <button className="action-btn delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="admin-settings">
      <h2>Admin Settings</h2>
      <div className="settings-grid">
        <div className="setting-card">
          <h3>General Settings</h3>
          <form>
            <div className="form-group">
              <label>Site Name</label>
              <input type="text" defaultValue="ZTO - Zero To One" />
            </div>
            <div className="form-group">
              <label>Admin Email</label>
              <input type="email" defaultValue="admin@zto.com" />
            </div>
            <div className="form-group">
              <label>Timezone</label>
              <select defaultValue="IST">
                <option value="IST">Indian Standard Time (IST)</option>
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Standard Time (EST)</option>
              </select>
            </div>
            <button type="submit" className="save-btn">Save Changes</button>
          </form>
        </div>

        <div className="setting-card">
          <h3>Security Settings</h3>
          <form>
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" />
            </div>
            <button type="submit" className="save-btn">Update Password</button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-container">
      {/* Mobile Menu Toggle */}
      <div className="mobile-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>ZTO Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-item ${activeTab === 'exams' ? 'active' : ''}`}
            onClick={() => setActiveTab('exams')}
          >
            📝 Exams
          </button>
          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Users
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn">🚪 Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <div className="admin-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <div className="admin-profile">
            <span>Welcome, Admin</span>
            <div className="profile-avatar">👤</div>
          </div>
        </div>

        <div className="admin-content">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'exams' && renderExams()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </div>
    </div>
  );
};

export default Admin; 
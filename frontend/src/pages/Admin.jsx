import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Admin.css';

const baseUrl = import.meta.env.VITE_BASE_URL;

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRegisteredForExams: 0,
    totalRevenue: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [examRegistrations, setExamRegistrations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalType, setModalType] = useState('view'); // 'view', 'edit', 'delete'
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
    fetchAllUsers();
  }, []);

  // Helper function to get auth config
  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const config = getAuthConfig();
      
      // Fetch all registered users from your site
      const usersResponse = await axios.get(`${baseUrl}/students`, config);
      const users = usersResponse.data || [];
      console.log('All users:', users.length, users);
      
      // Fetch students who have filled exam forms
      const registeredStudentsResponse = await axios.get(`${baseUrl}/registered`, config);
      const registeredStudents = registeredStudentsResponse.data || [];
      console.log('Exam registrations:', registeredStudents.length, registeredStudents);
      
      // Debug: Log the first registration to see available fields
      if (registeredStudents.length > 0) {
        console.log('Sample exam registration data structure:', registeredStudents[0]);
      }
      
      // Calculate stats
      const totalUsers = users.length;
      const totalRegisteredForExams = registeredStudents.length;
      const activeUsers = users.filter(user => user.status !== 'inactive').length;
      
      // Calculate revenue based on registered students (assuming ₹500 per registration)
      const totalRevenue = totalRegisteredForExams * 500;
      
      // Process exam registrations data
      const examRegistrationsData = registeredStudents.map(registration => ({
        id: registration._id,
        name: registration.fullname || 'N/A',
        email: registration.email,
        phone: registration.phone || 'N/A',
        school: registration.school || 'N/A',
        classs: registration.class || 'N/A',
        zone: registration.zone || 'N/A',
        parentName: registration.parentName || 'N/A',
        parentPhone: registration.parentPhone || 'N/A',
        registrationDate: new Date(registration.createdAt).toLocaleDateString(),
        paymentStatus: registration.payment ? 'Done' : 'Not Done'
      }));
      
      // Get recent users (last 4 registered)
      const recentUsersData = users.slice(-4).map(user => ({
        id: user._id,
        name: user.fullname || `${user.firstName || user.name || ''} ${user.lastName || ''}`.trim() || 'N/A',
        email: user.email,
        phone: user.phone || 'N/A',
        school: user.school || user.siteSchool || 'N/A',
        classs: user.classs || user.class || 'N/A',
        joinDate: new Date(user.createdAt).toLocaleDateString(),
        status: 'Active'
      }));
      
      setStats({
        totalUsers,
        totalRegisteredForExams,
        totalRevenue
      });
      
      setRecentUsers(recentUsersData);
      setExamRegistrations(examRegistrationsData);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // Check if it's an authentication error
      if (error.response && error.response.status === 401) {
        toast.error('Authentication required. Please login again.');
        // Redirect to login page
        window.location.href = '/login';
        return;
      }
      
      toast.error('Failed to load dashboard data');
      
      // Fallback to empty data
      setStats({ totalUsers: 0, totalRegisteredForExams: 0, totalRevenue: 0 });
      setRecentUsers([]);
      setExamRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const config = getAuthConfig();
      
      const usersResponse = await axios.get(`${baseUrl}/students`, config);
      const users = usersResponse.data || [];
      
      // Debug: Log the first user to see available fields
      if (users.length > 0) {
        console.log('Sample user data structure:', users[0]);
      }
      
      const allUsersData = users.map(user => ({
        id: user._id,
        name: user.fullname || `${user.firstName || user.name || ''} ${user.lastName || ''}`.trim() || 'N/A',
        email: user.email,
        phone: user.phone || 'N/A',
        school: user.school || user.siteSchool || 'N/A',
        classs: user.classs || user.class || 'N/A',
        joinDate: new Date(user.createdAt).toLocaleDateString(),
        status: 'Active',
        originalData: user // Keep original data for editing
      }));
      
      setAllUsers(allUsersData);
    } catch (error) {
      console.error('Error fetching all users:', error);
      
      // Check if it's an authentication error
      if (error.response && error.response.status === 401) {
        toast.error('Authentication required. Please login again.');
        window.location.href = '/login';
        return;
      }
      
      toast.error('Failed to load all users');
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setModalType('view');
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalType('edit');
    setShowUserModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setModalType('delete');
    setShowUserModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const config = getAuthConfig();
      
      await axios.delete(`${baseUrl}/students/${selectedUser.id}`, config);
      toast.success('User deleted successfully');
      setShowUserModal(false);
      setSelectedUser(null);
      fetchAllUsers(); // Refresh the list
      fetchDashboardData(); // Refresh dashboard stats
    } catch (error) {
      console.error('Error deleting user:', error);
      
      // Check if it's an authentication error
      if (error.response && error.response.status === 401) {
        toast.error('Authentication required. Please login again.');
        window.location.href = '/login';
        return;
      }
      
      toast.error('Failed to delete user');
    }
  };

  const handlePaymentStatusToggle = async (registrationId, currentStatus) => {
    try {
      const newPaymentValue = currentStatus === 'Done' ? false : true;
      const newStatus = newPaymentValue ? 'Done' : 'Not Done';
      const config = getAuthConfig();
      
      // Update payment status in backend
      let updateSuccess = false;
      
      try {
        // Try PATCH endpoint first
        await axios.patch(`${baseUrl}/registered/update/${registrationId}`, {
          payment: newPaymentValue
        }, config);
        updateSuccess = true;
      } catch (patchError) {
        console.log('PATCH failed, trying PUT...');
        
        try {
          // Try PUT endpoint
          await axios.put(`${baseUrl}/registered/update/${registrationId}`, {
            payment: newPaymentValue
          }, config);
          updateSuccess = true;
        } catch (putError) {
          console.log('PUT failed, trying POST...');
          
          try {
            // Try POST endpoint
            await axios.post(`${baseUrl}/registered/update/update`, {
              id: registrationId,
              payment: newPaymentValue
            }, config);
            updateSuccess = true;
          } catch (postError) {
            console.log('All update methods failed');
            throw postError;
          }
        }
      }
      
      if (updateSuccess) {
        // Update local state immediately
        setExamRegistrations(prevRegistrations => 
          prevRegistrations.map(reg => 
            reg.id === registrationId 
              ? { ...reg, paymentStatus: newStatus }
              : reg
          )
        );
        
        toast.success(`Payment status updated to ${newStatus}`);
      } else {
        toast.error('Failed to update payment status in database');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      
      // Check if it's an authentication error
      if (error.response && error.response.status === 401) {
        toast.error('Authentication required. Please login again.');
        window.location.href = '/login';
        return;
      }
      
      toast.error('Failed to update payment status in database');
    }
  };

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  const filteredRegistrations = examRegistrations.filter(registration =>
    registration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registration.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registration.phone.includes(searchTerm)
  );

  const renderDashboard = () => (
    <div className="admin-dashboard">
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
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
                <h3>{stats.totalRegisteredForExams}</h3>
                <p>Exam Registrations</p>
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
          <h3>Recent Exam Registrations</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>School</th>
                  <th>Class</th>
                  <th>Zone</th>
                  <th>Registration Date</th>
                  <th>Payment Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                                {examRegistrations.slice(0, 4).map(registration => (
                  <tr key={registration.id}>
                    <td>{registration.name}</td>
                    <td>{registration.email}</td>
                    <td>{registration.school}</td>
                    <td>{registration.classs}</td>
                    <td>{registration.zone}</td>
                    <td>{registration.registrationDate}</td>
                    <td>
                      <button 
                        className={`payment-status-btn ${registration.paymentStatus.toLowerCase().replace(' ', '-')}`}
                        onClick={() => handlePaymentStatusToggle(registration.id, registration.paymentStatus)}
                      >
                        {registration.paymentStatus}
                      </button>
                    </td>
                    <td>
                      <button className="action-btn view" onClick={() => handleViewUser(registration)}>View</button>
                      <button className="action-btn edit" onClick={() => handleEditUser(registration)}>Edit</button>
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
        </>
      )}
    </div>
  );



  const renderRegistrations = () => (
    <div className="admin-registrations">
      <div className="section-header">
        <h2>Exam Registrations</h2>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search registrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          <button className="add-btn" onClick={fetchDashboardData}>🔄 Refresh</button>
        </div>
      </div>
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading registrations...</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
                          <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>School</th>
                  <th>Class</th>
                  <th>Zone</th>
                  <th>Parent Name</th>
                  <th>Registration Date</th>
                  <th>Payment Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
            <tbody>
                              {filteredRegistrations.map(registration => (
                  <tr key={registration.id}>
                    <td>#{registration.id.slice(-6)}</td>
                    <td>{registration.name}</td>
                    <td>{registration.email}</td>
                    <td>{registration.phone}</td>
                    <td>{registration.school}</td>
                    <td>{registration.classs}</td>
                    <td>{registration.zone}</td>
                    <td>{registration.parentName}</td>
                    <td>{registration.registrationDate}</td>
                    <td>
                      <button 
                        className={`payment-status-btn ${registration.paymentStatus.toLowerCase().replace(' ', '-')}`}
                        onClick={() => handlePaymentStatusToggle(registration.id, registration.paymentStatus)}
                      >
                        {registration.paymentStatus}
                      </button>
                    </td>
                    <td>
                      <button className="action-btn view" onClick={() => handleViewUser(registration)}>View</button>
                      <button className="action-btn edit" onClick={() => handleEditUser(registration)}>Edit</button>
                      <button className="action-btn delete" onClick={() => handleDeleteUser(registration)}>Delete</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="admin-users">
      <div className="section-header">
        <h2>User Management</h2>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          <button className="add-btn" onClick={fetchAllUsers}>🔄 Refresh</button>
        </div>
      </div>
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>School</th>
                <th>Class</th>
                <th>Join Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>#{user.id.slice(-6)}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.school}</td>
                  <td>{user.classs}</td>
                  <td>{user.joinDate}</td>
                  <td>
                    <span className={`status-badge ${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <button className="action-btn view" onClick={() => handleViewUser(user)}>View</button>
                    <button className="action-btn edit" onClick={() => handleEditUser(user)}>Edit</button>
                    <button className="action-btn delete" onClick={() => handleDeleteUser(user)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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

  const renderUserModal = () => {
    if (!showUserModal || !selectedUser) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>
              {modalType === 'view' && 'View User Details'}
              {modalType === 'edit' && 'Edit User'}
              {modalType === 'delete' && 'Delete User'}
            </h3>
            <button className="modal-close" onClick={() => setShowUserModal(false)}>×</button>
          </div>
          
          <div className="modal-body">
            {modalType === 'view' && (
              <div className="user-details">
                <div className="detail-row">
                  <label>Name:</label>
                  <span>{selectedUser.name}</span>
                </div>
                <div className="detail-row">
                  <label>Email:</label>
                  <span>{selectedUser.email}</span>
                </div>
                <div className="detail-row">
                  <label>Phone:</label>
                  <span>{selectedUser.phone}</span>
                </div>
                <div className="detail-row">
                  <label>School:</label>
                  <span>{selectedUser.school}</span>
                </div>
                <div className="detail-row">
                  <label>Class:</label>
                  <span>{selectedUser.classs}</span>
                </div>
                <div className="detail-row">
                  <label>Join Date:</label>
                  <span>{selectedUser.joinDate}</span>
                </div>
                <div className="detail-row">
                  <label>Status:</label>
                  <span className={`status-badge ${selectedUser.status.toLowerCase()}`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>
            )}
            
            {modalType === 'delete' && (
              <div className="delete-confirmation">
                <p>Are you sure you want to delete this user?</p>
                <div className="user-info">
                  <strong>{selectedUser.name}</strong> ({selectedUser.email})
                </div>
                <p>This action cannot be undone.</p>
              </div>
            )}
          </div>
          
          <div className="modal-footer">
            {modalType === 'view' && (
              <button className="btn-secondary" onClick={() => setShowUserModal(false)}>Close</button>
            )}
            {modalType === 'delete' && (
              <>
                <button className="btn-secondary" onClick={() => setShowUserModal(false)}>Cancel</button>
                <button className="btn-danger" onClick={handleDeleteConfirm}>Delete User</button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-container">
      <ToastContainer />
      {renderUserModal()}
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
            className={`nav-item ${activeTab === 'registrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('registrations')}
          >
            📝 Exam Registrations
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
            {activeTab === 'dashboard' && (
              <button 
                className="refresh-btn" 
                onClick={fetchDashboardData}
                disabled={loading}
              >
                {loading ? '🔄' : '🔄'} Refresh
              </button>
            )}
            <span>Welcome, Admin</span>
            <div className="profile-avatar">👤</div>
          </div>
        </div>

        <div className="admin-content">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'registrations' && renderRegistrations()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </div>
    </div>
  );
};

export default Admin; 
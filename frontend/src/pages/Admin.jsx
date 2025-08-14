import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleRateLimitError } from '../utils/rateLimitHandler.js';
import AdminEdit from './adminEdit.jsx';
import './Admin.css';

const baseUrl = import.meta.env.VITE_BASE_URL;

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRegisteredForExams: 0,
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [examRegistrations, setExamRegistrations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalType, setModalType] = useState('view'); // 'view', 'edit', 'delete'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    name: '',
    description: '',
    amount: ''
  });
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  
  // Prompt management state
  const [prompts, setPrompts] = useState([]);
  const [newPrompt, setNewPrompt] = useState({
    title: '',
    prompt: '',
    customResponse: '',
    useCustomResponse: true
  });
  const [showAddPromptModal, setShowAddPromptModal] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
    fetchAllUsers();
    fetchExpenses();
    fetchPrompts();
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
      
     
      const usersResponse = await axios.get(`${baseUrl}/students`, config);
      const users = usersResponse.data || [];
     
      
      // Fetch students who have filled exam forms
      const registeredStudentsResponse = await axios.get(`${baseUrl}/registered`, config);
      const registeredStudents = registeredStudentsResponse.data || [];


      
      // Log the first registration to see available fields
      if (registeredStudents.length > 0) {
        console.log('Sample exam registration data structure:', registeredStudents[0]);
      }
      
      // Calculate stats
      const totalUsers = users.length;
      const totalRegisteredForExams = registeredStudents.length;
      const activeUsers = users.filter(user => user.status !== 'inactive').length;
      
      // Calculate revenue based on class-based pricing
      const totalRevenue = registeredStudents.reduce((total, registration) => {
        const classValue = parseInt(registration.class);
        let price = 0;
        
        if (classValue === 5 || classValue === 6) {
          price = 50;
        } else if (classValue === 7 || classValue === 8) {
          price = 75;
        } else if (classValue === 9 || classValue === 10) {
          price = 90;
        } else if (classValue === 11 || classValue === 12) {
          price = 100;
        }
        
        return total + price;
      }, 0);
      
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
        totalRevenue,
        totalExpenses: calculateTotalExpenses(),
        netProfit: totalRevenue - calculateTotalExpenses()
      });
      
      setRecentUsers(recentUsersData);
      setExamRegistrations(examRegistrationsData);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      try {
        handleRateLimitError(error, 'Failed to load dashboard data');
      } catch (handledError) {
        // Check if it's an authentication error
        if (handledError.response && handledError.response.status === 401) {
          toast.error('Authentication required. Please login again.');
          // Redirect to login page
          window.location.href = '/login';
          return;
        }
        
        toast.error('Failed to load dashboard data');
      }
      
      // Fallback to empty data
      setStats({ 
        totalUsers: 0, 
        totalRegisteredForExams: 0, 
        totalRevenue: 0, 
        totalExpenses: 0,
        netProfit: 0 
      });
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
      
      try {
        handleRateLimitError(error, 'Failed to load all users');
      } catch (handledError) {
        // Check if it's an authentication error
        if (handledError.response && handledError.response.status === 401) {
          toast.error('Authentication required. Please login again.');
          window.location.href = '/login';
          return;
        }
        
        toast.error('Failed to load all users');
      }
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
      
      try {
        handleRateLimitError(error, 'Failed to delete user');
      } catch (handledError) {
        // Check if it's an authentication error
        if (handledError.response && handledError.response.status === 401) {
          toast.error('Authentication required. Please login again.');
          window.location.href = '/login';
          return;
        }
        
        toast.error('Failed to delete user');
      }
    }
  };

  // Registration handlers
  const handleViewRegistration = (registration) => {
    setSelectedRegistration(registration);
    setModalType('view');
    setShowRegistrationModal(true);
  };

  const handleEditRegistration = (registration) => {
    setSelectedRegistration(registration);
    setModalType('edit');
    setShowRegistrationModal(true);
  };

  const handleDeleteRegistration = (registration) => {
    setSelectedRegistration(registration);
    setModalType('delete');
    setShowRegistrationModal(true);
  };

  const handleRegistrationUpdate = (updatedData) => {
    if (updatedData === null) {
      // Registration was deleted
      setShowRegistrationModal(false);
      setSelectedRegistration(null);
      fetchDashboardData();
      return;
    }
    
    // Update local state
    setExamRegistrations(prevRegistrations => 
      prevRegistrations.map(reg => 
        reg.id === selectedRegistration.id 
          ? { ...reg, ...updatedData }
          : reg
      )
    );
    
    setShowRegistrationModal(false);
    setSelectedRegistration(null);
    fetchDashboardData();
  };

  const handlePaymentStatusToggle = (registrationId, currentStatus) => {
    // Find the registration and open edit modal
    const registration = examRegistrations.find(reg => reg.id === registrationId);
    if (registration) {
      setSelectedRegistration(registration);
      setModalType('edit');
      setShowRegistrationModal(true);
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

  // Expense-related functions
  const fetchExpenses = async () => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${baseUrl}/expenses`, config);
      setExpenses(response.data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      try {
        handleRateLimitError(error, 'Failed to load expenses');
      } catch (handledError) {
        if (handledError.response?.status === 401) {
          toast.error('Authentication required. Please login again.');
          window.location.href = '/login';
          return;
        }
        toast.error('Failed to load expenses');
      }
    }
  };

  const addExpense = async (e) => {
    e.preventDefault();
    try {
      const config = getAuthConfig();
      const response = await axios.post(`${baseUrl}/expenses`, newExpense, config);
      toast.success('Expense added successfully');
      setNewExpense({ name: '', description: '', amount: '' });
      setShowAddExpenseModal(false);
      fetchExpenses(); // Refresh the expenses list
    } catch (error) {
      console.error('Error adding expense:', error);
      try {
        handleRateLimitError(error, 'Failed to add expense');
      } catch (handledError) {
        if (handledError.response?.status === 401) {
          toast.error('Authentication required. Please login again.');
          window.location.href = '/login';
          return;
        }
        toast.error('Failed to add expense');
      }
    }
  };

  const deleteExpense = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }
    try {
      const config = getAuthConfig();
      await axios.delete(`${baseUrl}/expenses/${expenseId}`, config);
      toast.success('Expense deleted successfully');
      fetchExpenses(); // Refresh the expenses list
    } catch (error) {
      console.error('Error deleting expense:', error);
      try {
        handleRateLimitError(error, 'Failed to delete expense');
      } catch (handledError) {
        if (handledError.response?.status === 401) {
          toast.error('Authentication required. Please login again.');
          window.location.href = '/login';
          return;
        }
        toast.error('Failed to delete expense');
      }
    }
  };

  const calculateTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  // Prompt management functions
  const fetchPrompts = async () => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${baseUrl}/admin/prompts`, config);
      setPrompts(response.data.prompts || []);
    } catch (err) {
      console.error('Error fetching prompts:', err);
      toast.error('Failed to fetch prompts');
    }
  };

  const addPrompt = async (e) => {
    e.preventDefault();
    try {
      const config = getAuthConfig();
      const response = await axios.post(`${baseUrl}/admin/prompts`, newPrompt, config);
      toast.success('Prompt added successfully');
      setShowAddPromptModal(false);
      setNewPrompt({ title: '', prompt: '', customResponse: '', useCustomResponse: true });
      fetchPrompts();
    } catch (err) {
      console.error('Error adding prompt:', err);
      toast.error('Failed to add prompt');
    }
  };

  const updatePrompt = async (e) => {
    e.preventDefault();
    try {
      const config = getAuthConfig();
      const response = await axios.put(`${baseUrl}/admin/prompts/${editingPrompt.id}`, editingPrompt, config);
      toast.success('Prompt updated successfully');
      setShowAddPromptModal(false);
      setEditingPrompt(null);
      fetchPrompts();
    } catch (err) {
      console.error('Error updating prompt:', err);
      toast.error('Failed to update prompt');
    }
  };

  const deletePrompt = async (promptId) => {
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      try {
        const config = getAuthConfig();
        await axios.delete(`${baseUrl}/admin/prompts/${promptId}`, config);
        toast.success('Prompt deleted successfully');
        fetchPrompts();
      } catch (err) {
        console.error('Error deleting prompt:', err);
        toast.error('Failed to delete prompt');
      }
    }
  };

  const handleEditPrompt = (prompt) => {
    setEditingPrompt(prompt);
    setShowAddPromptModal(true);
  };

  const handleAddPrompt = () => {
    setEditingPrompt(null);
    setNewPrompt({ title: '', prompt: '', customResponse: '', useCustomResponse: true });
    setShowAddPromptModal(true);
  };

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
            <div className="stat-card">
              <div className="stat-icon expense-icon">💸</div>
              <div className="stat-content">
                <h3>₹{stats.totalExpenses.toLocaleString()}</h3>
                <p>Total Expenses</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon profit-icon">📈</div>
              <div className="stat-content">
                <h3 className={stats.netProfit >= 0 ? 'positive-profit' : 'negative-profit'}>
                  ₹{stats.netProfit.toLocaleString()}
                </h3>
                <p>Net Profit</p>
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
                </tr>
              </thead>
              <tbody>
                {recentUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.joinDate}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderExpenses = () => (
    <div className="admin-expenses">
      <div className="section-header">
        <h2>Expense Management</h2>
        <div className="header-actions">
          <button className="add-btn" onClick={() => setShowAddExpenseModal(true)}>
            ➕ Add Expense
          </button>
          <button className="refresh-btn" onClick={fetchExpenses}>
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="expense-summary">
        <div className="summary-card">
          <h3>Total Expenses</h3>
          <p className="total-amount">₹{calculateTotalExpenses().toLocaleString()}</p>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(expense => (
              <tr key={expense._id}>
                <td>{expense.name}</td>
                <td>{expense.description}</td>
                <td>₹{expense.amount.toLocaleString()}</td>
                <td>{new Date(expense.createdAt || expense._id).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="action-btn delete" 
                    onClick={() => deleteExpense(expense._id)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="modal-overlay" onClick={() => setShowAddExpenseModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Expense</h3>
              <button className="modal-close" onClick={() => setShowAddExpenseModal(false)}>×</button>
            </div>
            <form onSubmit={addExpense} className="modal-body">
              <div className="form-group">
                <label>Expense Name</label>
                <input
                  type="text"
                  value={newExpense.name}
                  onChange={(e) => setNewExpense({...newExpense, name: e.target.value})}
                  placeholder="Enter expense name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  placeholder="Enter expense description"
                  required
                />
              </div>
              <div className="form-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: parseFloat(e.target.value) || ''})}
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddExpenseModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Add Expense
                </button>
              </div>
            </form>
          </div>
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

  const renderPrompts = () => (
    <div className="admin-prompts">
      <div className="section-header">
        <h2>AI Assistant Prompts</h2>
        <button className="add-btn" onClick={handleAddPrompt}>
          ➕ Add New Prompt
        </button>
      </div>

      <div className="prompts-grid">
        {prompts.map((prompt) => (
          <div key={prompt.id} className="prompt-card">
            <div className="prompt-header">
              <h3>{prompt.title}</h3>
              <div className="prompt-actions">
                <button 
                  className="edit-btn" 
                  onClick={() => handleEditPrompt(prompt)}
                  title="Edit Prompt"
                >
                  ✏️
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => deletePrompt(prompt.id)}
                  title="Delete Prompt"
                >
                  🗑️
                </button>
              </div>
            </div>
            <div className="prompt-content">
              <div className="prompt-field">
                <label>Question:</label>
                <p>{prompt.prompt}</p>
              </div>
              <div className="prompt-field">
                <label>Response Type:</label>
                <span className={`response-type ${prompt.useCustomResponse ? 'custom' : 'ai'}`}>
                  {prompt.useCustomResponse ? 'Custom Response' : 'AI Response'}
                </span>
              </div>
              {prompt.useCustomResponse && prompt.customResponse && (
                <div className="prompt-field">
                  <label>Custom Response:</label>
                  <div className="custom-response">
                    {prompt.customResponse}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Prompt Modal */}
      {showAddPromptModal && (
        <div className="modal-overlay" onClick={() => setShowAddPromptModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingPrompt ? 'Edit Prompt' : 'Add New Prompt'}</h3>
              <button className="modal-close" onClick={() => setShowAddPromptModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={editingPrompt ? updatePrompt : addPrompt}>
                <div className="form-group">
                  <label>Title *</label>
                  <input 
                    type="text" 
                    value={editingPrompt ? editingPrompt.title : newPrompt.title}
                    onChange={(e) => editingPrompt 
                      ? setEditingPrompt({...editingPrompt, title: e.target.value})
                      : setNewPrompt({...newPrompt, title: e.target.value})
                    }
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Question/Prompt *</label>
                  <textarea 
                    value={editingPrompt ? editingPrompt.prompt : newPrompt.prompt}
                    onChange={(e) => editingPrompt 
                      ? setEditingPrompt({...editingPrompt, prompt: e.target.value})
                      : setNewPrompt({...newPrompt, prompt: e.target.value})
                    }
                    required
                    rows={3}
                  />
                </div>
                
                <div className="form-group">
                  <label>Response Type</label>
                  <select 
                    value={editingPrompt ? editingPrompt.useCustomResponse : newPrompt.useCustomResponse}
                    onChange={(e) => editingPrompt 
                      ? setEditingPrompt({...editingPrompt, useCustomResponse: e.target.value === 'true'})
                      : setNewPrompt({...newPrompt, useCustomResponse: e.target.value === 'true'})
                    }
                  >
                    <option value={true}>Custom Response</option>
                    <option value={false}>AI Response</option>
                  </select>
                </div>
                
                {(editingPrompt ? editingPrompt.useCustomResponse : newPrompt.useCustomResponse) && (
                  <div className="form-group">
                    <label>Custom Response</label>
                    <textarea 
                      value={editingPrompt ? editingPrompt.customResponse : newPrompt.customResponse}
                      onChange={(e) => editingPrompt 
                        ? setEditingPrompt({...editingPrompt, customResponse: e.target.value})
                        : setNewPrompt({...newPrompt, customResponse: e.target.value})
                      }
                      rows={6}
                      placeholder="Enter your custom response here..."
                    />
                  </div>
                )}
                
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowAddPromptModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    {editingPrompt ? 'Update Prompt' : 'Add Prompt'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
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
      {showRegistrationModal && selectedRegistration && (
        <AdminEdit
          registration={selectedRegistration}
          onUpdate={handleRegistrationUpdate}
          onCancel={() => setShowRegistrationModal(false)}
          modalType={modalType}
          baseUrl={baseUrl}
          getAuthConfig={getAuthConfig}
        />
      )}
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
            className={`nav-item ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('expenses')}
          >
            💰 Expenses
          </button>
          <button 
            className={`nav-item ${activeTab === 'prompts' ? 'active' : ''}`}
            onClick={() => setActiveTab('prompts')}
          >
            🤖 AI Prompts
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
          {activeTab === 'expenses' && renderExpenses()}
          {activeTab === 'prompts' && renderPrompts()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </div>
    </div>
  );
};

export default Admin; 
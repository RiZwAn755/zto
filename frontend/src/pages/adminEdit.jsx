import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import './Admin.css';

const AdminEdit = ({ 
  registration, 
  onUpdate, 
  onCancel, 
  modalType = 'edit',
  baseUrl,
  getAuthConfig 
}) => {
  const [formData, setFormData] = useState({
    fullname: registration?.name || '',
    email: registration?.email || '',
    phone: registration?.phone || '',
    school: registration?.school || '',
    class: registration?.classs || '',
    zone: registration?.zone || '',
    parentName: registration?.parentName || '',
    parentPhone: registration?.parentPhone || '',
    address: registration?.address || '',
    dob: registration?.dob ? new Date(registration.dob).toISOString().split('T')[0] : '',
    payment: registration?.paymentStatus === 'Done'
  });

  const [quickEditField, setQuickEditField] = useState(null);
  const [quickEditValue, setQuickEditValue] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const config = getAuthConfig();
      
      // Map form data to backend field names
      const updateData = {
        fullname: formData.fullname,
        email: formData.email,
        phone: formData.phone,
        school: formData.school,
        class: formData.class,
        zone: formData.zone,
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        address: formData.address,
        dob: formData.dob,
        payment: formData.payment
      };
      
      console.log('Submitting form data:', updateData);
      
      await axios.patch(`${baseUrl}/registered/update/${registration.id}`, updateData, config);
      
      toast.success('Registration updated successfully');
      
      // Notify parent component with updated registration
      const updatedRegistration = {
        ...registration,
        ...updateData
      };
      onUpdate(updatedRegistration);
    } catch (error) {
      console.error('Error updating registration:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
   
    }
  };

  const handleDelete = async () => {
    try {
      const config = getAuthConfig();
      await axios.delete(`${baseUrl}/registered/update/${registration.id}`, config);
      
      toast.success('Registration deleted successfully');
      onUpdate(null); // Signal deletion
    } catch (error) {
      console.error('Error deleting registration:', error);

    }
  };

  // Quick edit functionality
  const handleQuickEdit = (field, currentValue) => {
    setQuickEditField(field);
    setQuickEditValue(currentValue);
  };

  // Test API connection
  const testApiConnection = async () => {
    try {
      const config = getAuthConfig();
      const response = await axios.get(`${baseUrl}/registered/update/test`, config);
      console.log('API test response:', response.data);
    } catch (error) {
      console.error('API test failed:', error);
    }
  };

  // Test API on component mount
  React.useEffect(() => {
    testApiConnection();
  }, []);

  const handleQuickEditSave = async () => {
    if (!quickEditField) return;

    try {
      const config = getAuthConfig();
      
      // Map frontend field names to backend field names
      const fieldMapping = {
        'fullname': 'fullname',
        'email': 'email',
        'phone': 'phone',
        'school': 'school',
        'parentName': 'parentName',
        'parentPhone': 'parentPhone'
      };
      
      const backendField = fieldMapping[quickEditField] || quickEditField;
      
      // For quick edits, we only update the specific field
      const updateData = { [backendField]: quickEditValue };
      
      console.log('Updating field:', backendField, 'with value:', quickEditValue);
      console.log('Update data:', updateData);
      
      await axios.patch(`${baseUrl}/registered/update/${registration.id}`, updateData, config);
      
      // Update local form data
      setFormData(prev => ({
        ...prev,
        [quickEditField]: quickEditValue
      }));
      
      toast.success(`${quickEditField} updated successfully`);
      setQuickEditField(null);
      setQuickEditValue('');
      
      // Notify parent component with updated data
      const updatedRegistration = {
        ...registration,
        [backendField]: quickEditValue
      };
      onUpdate(updatedRegistration);
    } catch (error) {
      console.error('Error updating field:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      

    }
  };

  const handleQuickEditCancel = () => {
    setQuickEditField(null);
    setQuickEditValue('');
  };

  const handlePaymentStatusToggle = async () => {
    try {
      const newPaymentValue = !formData.payment;
      const config = getAuthConfig();
      
      // Only update payment status
      const updateData = { payment: newPaymentValue };
      
      await axios.patch(`${baseUrl}/registered/update/${registration.id}`, updateData, config);
      
      setFormData(prev => ({
        ...prev,
        payment: newPaymentValue
      }));
      
      toast.success(`Payment status updated to ${newPaymentValue ? 'Done' : 'Not Done'}`);
      
      // Notify parent component
      onUpdate({ ...formData, payment: newPaymentValue });
    } catch (error) {
      console.error('Error updating payment status:', error);
      

    }
  };

  // Quick edit table view
  const QuickEditTable = () => (
    <div className="quick-edit-table">
      <h4>Quick Edit Fields</h4>
      <div className="quick-edit-grid">
        <div className="quick-edit-item">
          <label>Name:</label>
          <span 
            className="editable-field"
            onClick={() => handleQuickEdit('fullname', formData.fullname)}
            title="Click to edit"
          >
            {formData.fullname}
          </span>
        </div>
        <div className="quick-edit-item">
          <label>Email:</label>
          <span 
            className="editable-field"
            onClick={() => handleQuickEdit('email', formData.email)}
            title="Click to edit"
          >
            {formData.email}
          </span>
        </div>
        <div className="quick-edit-item">
          <label>Phone:</label>
          <span 
            className="editable-field"
            onClick={() => handleQuickEdit('phone', formData.phone)}
            title="Click to edit"
          >
            {formData.phone}
          </span>
        </div>
        <div className="quick-edit-item">
          <label>School:</label>
          <span 
            className="editable-field"
            onClick={() => handleQuickEdit('school', formData.school)}
            title="Click to edit"
          >
            {formData.school}
          </span>
        </div>
        <div className="quick-edit-item">
          <label>Parent Name:</label>
          <span 
            className="editable-field"
            onClick={() => handleQuickEdit('parentName', formData.parentName)}
            title="Click to edit"
          >
            {formData.parentName}
          </span>
        </div>
        <div className="quick-edit-item">
          <label>Payment Status:</label>
          <button 
            className={`payment-status-btn ${formData.payment ? 'done' : 'not-done'}`}
            onClick={handlePaymentStatusToggle}
          >
            {formData.payment ? 'Done' : 'Not Done'}
          </button>
        </div>
        <div className="quick-edit-item">
          <label>Debug:</label>
          <button 
            className="btn-secondary"
            onClick={testApiConnection}
            style={{ fontSize: '12px', padding: '4px 8px' }}
          >
            Test API
          </button>
        </div>
      </div>
    </div>
  );

  // View mode - display only
  if (modalType === 'view') {
    return (
      <div className="modal-overlay" onClick={onCancel}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>View Registration Details</h3>
            <button className="modal-close" onClick={onCancel}>×</button>
          </div>
          
          <div className="modal-body">
            <div className="user-details">
              <div className="detail-row">
                <label>Name:</label>
                <span>{registration.name}</span>
              </div>
              <div className="detail-row">
                <label>Email:</label>
                <span>{registration.email}</span>
              </div>
              <div className="detail-row">
                <label>Phone:</label>
                <span>{registration.phone}</span>
              </div>
              <div className="detail-row">
                <label>School:</label>
                <span>{registration.school}</span>
              </div>
              <div className="detail-row">
                <label>Class:</label>
                <span>{registration.classs}</span>
              </div>
              <div className="detail-row">
                <label>Zone:</label>
                <span>{registration.zone}</span>
              </div>
              <div className="detail-row">
                <label>Parent Name:</label>
                <span>{registration.parentName}</span>
              </div>
              <div className="detail-row">
                <label>Parent Phone:</label>
                <span>{registration.parentPhone}</span>
              </div>
              <div className="detail-row">
                <label>Registration Date:</label>
                <span>{registration.registrationDate}</span>
              </div>
              <div className="detail-row">
                <label>Payment Status:</label>
                <span className={`status-badge ${registration.paymentStatus.toLowerCase().replace(' ', '-')}`}>
                  {registration.paymentStatus}
                </span>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button className="btn-secondary" onClick={onCancel}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  // Delete confirmation mode
  if (modalType === 'delete') {
    return (
      <div className="modal-overlay" onClick={onCancel}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Delete Registration</h3>
            <button className="modal-close" onClick={onCancel}>×</button>
          </div>
          
          <div className="modal-body">
            <div className="delete-confirmation">
              <p>Are you sure you want to delete this registration?</p>
              <div className="user-info">
                <strong>{registration.name}</strong> ({registration.email})
              </div>
              <p>This action cannot be undone.</p>
            </div>
          </div>
          
          <div className="modal-footer">
            <button className="btn-secondary" onClick={onCancel}>Cancel</button>
            <button className="btn-danger" onClick={handleDelete}>Delete Registration</button>
          </div>
        </div>
      </div>
    );
  }

  // Edit mode - full form
  return (
    <>
      <div className="modal-overlay" onClick={onCancel}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Edit Registration</h3>
            <button className="modal-close" onClick={onCancel}>×</button>
          </div>
          
          <div className="modal-body">
            <QuickEditTable />
            <hr style={{ margin: '20px 0', border: '1px solid #e1e5e9' }} />
            <form onSubmit={handleSubmit} className="edit-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name:</label>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone:</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>School:</label>
                  <input
                    type="text"
                    name="school"
                    value={formData.school}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Class:</label>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Class</option>
                    <option value="8">Class 8</option>
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Zone:</label>
                  <select
                    name="zone"
                    value={formData.zone}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Zone</option>
                    <option value="Badlapur">Badlapur</option>
                    <option value="Singhramau">Singhramau</option>
                    <option value="Dhakwa">Dhakwa</option>
                    <option value="Khutahan">Khutahan</option>
                    <option value="MaharajGanj">MaharajGanj</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Parent Name:</label>
                  <input
                    type="text"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Parent Phone:</label>
                  <input
                    type="tel"
                    name="parentPhone"
                    value={formData.parentPhone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Address:</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Enter full address"
                  />
                </div>
                <div className="form-group">
                  <label>Date of Birth:</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Payment Status:</label>
                  <select
                    name="payment"
                    value={formData.payment}
                    onChange={handleInputChange}
                  >
                    <option value={true}>Payment Done</option>
                    <option value={false}>Payment Pending</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Registration ID:</label>
                  <input
                    type="text"
                    value={registration.id}
                    disabled
                    className="disabled-input"
                    style={{ backgroundColor: '#f5f5f5', color: '#666' }}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={onCancel}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Quick Edit Modal */}
      {quickEditField && (
        <div className="modal-overlay" onClick={handleQuickEditCancel}>
          <div className="modal-content quick-edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Quick Edit - {quickEditField}</h3>
              <button className="modal-close" onClick={handleQuickEditCancel}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>{quickEditField.charAt(0).toUpperCase() + quickEditField.slice(1)}:</label>
                <input
                  type="text"
                  value={quickEditValue}
                  onChange={(e) => setQuickEditValue(e.target.value)}
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleQuickEditSave();
                    }
                  }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleQuickEditCancel}>Cancel</button>
              <button className="btn-primary" onClick={handleQuickEditSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminEdit;

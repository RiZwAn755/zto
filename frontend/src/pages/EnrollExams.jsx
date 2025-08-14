import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EnrollExams.css';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleRateLimitError } from '../utils/rateLimitHandler.js';
const baseURL = import.meta.env.VITE_BASE_URL;

const EnrollExams = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    address: '',
    school: '',
    class: '',
    zone: '',
    phone: '',
    email: '',
    parentName: '',
    parentPhone: '',
    dob: ''
  });
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!baseURL) {
      toast.error('Server URL not set.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        class: Number(formData.class),
        phone: formData.phone.trim(),
        parentPhone: formData.parentPhone.trim(),
      };
      const token = localStorage.getItem('token'); // or wherever you store your token

      await axios.post(
        `${baseURL}/regForm`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success('Registration successful!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      try {
        handleRateLimitError(err, 'Registration failed. Please check your details.');
      } catch (handledError) {
        if (handledError.response && handledError.response.data && handledError.response.data.error) {
          toast.error(`Registration failed: ${handledError.response.data.error}`);
        } else {
          toast.error('Registration failed. Please check your details.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <Navbar />
      <div className="enroll-exams-container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
            backgroundColor: "#f7f8fa",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "30px",
              borderRadius: "10px",
              backgroundColor: "#ffffff",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              width: "100%",
              maxWidth: "400px",
              marginTop: "100px",
            }}
          >
            
            <h2 style={{ marginBottom: "20px", color: "#2a4d8f"  }}>
              Student Exam Registration
            </h2>

            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={formData.fullname}
              onChange={handleChange}
              style={inputStyle}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              style={inputStyle}
              required
            />
            <input
              type="text"
              name="school"
              placeholder="School Name"
              value={formData.school}
              onChange={handleChange}
              style={inputStyle}
              required
            />
            <select
              name="class"
              value={formData.class}
              onChange={handleChange}
              style={inputStyle}
              required
            >
              <option value="">Select Class</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
            </select>
            <select
              name="zone"
              value={formData.zone}
              onChange={handleChange}
              style={inputStyle}
              required
            >
              <option value="">Select Zone</option>
              <option value="Badlapur">Badlapur</option>
              <option value="Singhramau">Singhramau</option>
              <option value="Dhakwa">Dhakwa</option>
              <option value="Khutahan">Khutahan</option>
              <option value="MaharajGanj">MaharajGanj</option>
            </select>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              style={inputStyle}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
              required
            />
            <input
              type="text"
              name="parentName"
              placeholder="Parent's Name"
              value={formData.parentName}
              onChange={handleChange}
              style={inputStyle}
              required
            />
            <input
              type="text"
              name="parentPhone"
              placeholder="Parent's Phone Number"
              value={formData.parentPhone}
              onChange={handleChange}
              style={inputStyle}
              required
            />
            <input
              type="date"
              name="dob"
              placeholder="Date of Birth"
              value={formData.dob}
              onChange={handleChange}
              style={inputStyle}
              required
            />
            <button
              type="submit"
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                border: "none",
                backgroundColor: "#2a4d8f",
                color: "white",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "1rem",
              }}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EnrollExams;
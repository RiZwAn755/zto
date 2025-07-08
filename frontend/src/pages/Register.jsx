import React, { useState } from 'react';
import './Register.css';
import Navbar from '../Components/Navbar';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const baseUrl = import.meta.env.VITE_BASE_URL;

const RegisterPage = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    school: '',
    classs: '',
    phone: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {data} = await axios.post(`${baseUrl}/stReg` , formData);
    if(data)
    {
        setIsSubmitting(true);
    console.log('Form submitted:', formData);
    toast.success('Registered successfully , You can login now');
    
    setTimeout(() => {
      setIsSubmitting(false);
       navigate('/login');
    }, 1500);
    }
   
  };

  return (
    <>
        <Navbar/>
        <div className="register-container">
        <div className="register-card">
            <div className="register-header">
            <h1>Let's Register</h1>
            <h2>Account</h2>
            <p className="welcome-message">Hello user, you have a grateful journey</p>
            </div>

            <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                />
            </div>

            <div className="form-group">
                <label htmlFor="school">School/Coaching</label>
                <input
                type="text"
                id="school"
                name="school"
                value={formData.school}
                onChange={handleChange}
                placeholder="Enter your school or coaching name"
                required
                />
            </div>

            <div className="form-group">
                <label htmlFor="classs">Class</label>
                <input
                type="number"
                id="classs"
                name="classs"
                value={formData.classs}
                onChange={handleChange}
                placeholder="Enter your class"
                required
                />
            </div>

            <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                />
            </div>

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-container">
                <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                />
                <span 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? '🙈' : '👁️'}
                </span>
                </div>
            </div>

            <button type="submit" className="register-button" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>
            </form>

            <div className="login-redirect">
            Already have an account? <a href="/login">Login</a>
            </div>
        </div>
        </div>
    </>
  );
};

export default RegisterPage;
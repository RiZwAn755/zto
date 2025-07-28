import React, { useState } from 'react';
import './Register.css';
import Navbar from '../Components/Navbar';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleLogin } from '@react-oauth/google';
const baseUrl = import.meta.env.VITE_BASE_URL;

const RegisterPage = () => {

  const handGooglereg= (e) =>{
    e.preventDefault();
    console.log("signup with google");
  }

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
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value) error = "Name is required";
        else if (value.length < 2) error = "Name must be at least 2 characters";
        break;
      case "school":
        if (!value) error = "School is required";
        else if (value.length < 2) error = "School name must be at least 2 characters";
        break;
      case "classs":
        if (!value) error = "Class is required";
        else if (!["8", "9", "10", "11", "12"].includes(value)) error = "Class must be 8, 9, 10, 11, or 12";
        break;
      case "phone":
        if (!value) error = "Phone is required";
        else if (!/^\d{10}$/.test(value)) error = "Phone number must be 10 digits";
        break;
      case "email":
        if (!value) error = "Email is required";
        else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) error = "Please enter a valid email address";
        break;
      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 6) error = "Password must be at least 6 characters";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate this field as user types
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    try {
      const {data} = await axios.post(`${baseUrl}/stReg` , formData);
      setIsSubmitting(true);
      toast.success('Registered successfully , You can login now');
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/login');
      }, 1500);
    } catch (err) {
      if (err.response && err.response.status === 409 && err.response.data && err.response.data.error === "Email already exists") {
        toast.error('Email already exists');
      } else if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsSubmitting(true);
      console.log('Attempting Google auth with URL:', `${baseUrl}/auth/google`);
      const { data } = await axios.post(`${baseUrl}/auth/google`, {
        token: credentialResponse.credential
      });
      
      if (data && data.token) {
        localStorage.setItem("email", data.user.email);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userType', data.user.userType);
        toast.success('Google registration successful!');
        setTimeout(() => {
          if (data.user.userType === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }, 1000);
      }
    } catch (err) {
      console.error('Google registration error:', err);
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(`Google registration failed: ${err.response.data.error}`);
      } else {
        toast.error('Google registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google registration failed. Please try again.');
  };

  return (
    <>
        <Navbar/>
        <ToastContainer />
        <div className="register-container">
        <div className="register-card">
            <div className="register-header">
            <h1>Let's Register</h1>
            <h2>Account</h2>
            <p className="welcome-message">Hey, there! Wishing you a wonderful journey at ZTO</p>
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
                {errors.name && <div className="error-message">{errors.name}</div>}
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
                {errors.school && <div className="error-message">{errors.school}</div>}
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
                {errors.classs && <div className="error-message">{errors.classs}</div>}
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
                {errors.phone && <div className="error-message">{errors.phone}</div>}
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
                {errors.email && <div className="error-message">{errors.email}</div>}
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
                {errors.password && <div className="error-message">{errors.password}</div>}
            </div>

            <button type="submit" className="register-button" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>
            </form>

            <div className="divider">
            <span>or</span>
          </div>
                  
            <div className="social-icons">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                disabled={isSubmitting}
                theme="outline"
                size="large"
                text="signup_with"
                shape="rectangular"
                width="300"
              />
            </div>
          
            <div className="login-redirect">
            Already have an account? <a href="/login">Login</a>
            </div>
        </div>
        </div>
    </>
  );
};

export default RegisterPage;
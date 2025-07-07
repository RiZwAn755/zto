import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);


  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:3000/Login', formData);
      if (data) {
        localStorage.setItem("email", formData.email);
        toast.success('Logged in successfully!');
        if(data.role === "admin"){
          setTimeout(() => navigate("/admin"), 1500); // Wait for toast before redirect
        }
        else{
          setTimeout(() => navigate("/"), 1500); // Wait for toast before redirect
        }
      } else {
        toast.error('Unable to login');
      }
    } catch (err) {
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-wrapper">
      <ToastContainer />
      <div className="login-card">
        <h2>Lets Sign you in</h2>
        <p>Welcome Back,<br />You have been missed</p>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="password-field">
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
          </div>

          <div className="forgot-password">
            <a href="#farhan">Forgot Password?</a>
          </div>

          <button type="submit" className="sign-in-btn">Sign in</button>

          

          <div className="divider">
            <span>or</span>
          </div>

          <div className="social-icons">
            <img src="/google_login_image.jpg" alt="Google login" />
         </div>

          <p className="register-link">
            Don’t have an account? <a href="/register">Register Now</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
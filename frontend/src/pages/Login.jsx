import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const baseUrl = import.meta.env.VITE_BASE_URL;

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${baseUrl}/Login`, formData);
      if (data) {
        localStorage.setItem("email", formData.email);
        toast.success('Logged in successfully!');
        setTimeout(() => {
          if (data.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }, 1000);
      } else {
        toast.error('Unable to login');
      }
    } catch (err) {
      // Show backend error if available
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(`Login failed: ${err.response.data.error}`);
      } else {
        toast.error('Login failed. Please check your credentials or try again later.');
      }
    } finally {
      setLoading(false);
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
            disabled={loading}
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
                disabled={loading}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer" }}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
          </div>

          <div className="forgot-password">
            <a href="#farhan">Forgot Password?</a>
          </div>

          <button type="submit" className="sign-in-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

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
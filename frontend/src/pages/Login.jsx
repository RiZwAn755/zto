import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom';
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
    const trimmedFormData = {
      email: formData.email.trim(),
      password: formData.password.trim()
    };
    try {
      const { data } = await axios.post(
        `${baseUrl}/Login`,
        trimmedFormData,
        { withCredentials: true }
      );
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
      toast.error('Unable to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${baseUrl}/auth/google`,
        { token: credentialResponse.credential },
        { withCredentials: true }
      );
      if (data && data.user) {
        localStorage.setItem("email", data.user.email);
        localStorage.setItem('userType', data.user.userType);
        toast.success('Google login successful!');
        setTimeout(() => {
          if (data.user.userType === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }, 1000);
      } else {
        toast.error('Google login failed. Please try again.');
      }
    } catch (err) {
      toast.error('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google login failed. Please try again.');
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

          <div className="forgotpassword">
            <Link to = "/forgotPassword">Forgot Password?</Link>
          </div>

          <button type="submit" className="sign-in-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <div className="social-icons">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              disabled={loading}
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
              width="300"
            />
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
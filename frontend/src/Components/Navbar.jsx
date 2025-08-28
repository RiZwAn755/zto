import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check login status using /me endpoint
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${baseUrl}/me`, { withCredentials: true });
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      // Optional: call backend to clear cookie if you have a logout endpoint
      await axios.post(`${baseUrl}/logout`, {}, { withCredentials: true });
    } catch {}
    toast.success('Log out successful!');
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    setTimeout(() => {
      navigate("/landing");
    }, 1000);
  };

  return (
    <>
      <ToastContainer />
      <nav className={`navbar ${isOpen ? 'open' : ''} ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-logo">
          <button style={{ backgroundColor: 'transparent', border: 'none', }}   onClick={() => navigate("/")}> <h1>ZTO</h1></button>
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          <span className={isOpen ? 'active' : ''}></span>
          <span className={isOpen ? 'active' : ''}></span>
          <span className={isOpen ? 'active' : ''}></span>
        </div>

        {isOpen ? (
          <div className="navbar-menu-group">
            <ul className="navbar-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/exams">Exams</Link></li>
              <li><Link to="/resources">Resources</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to='/checkresult'> Results </Link></li>
            </ul>
            <div className="navbar-buttons">
              {!isLoggedIn && (
                <button className="login-btn" onClick={handleLogin}>Login</button>
              )}
              {isLoggedIn && (
                <button className="getstarted-btn" onClick={handleLogout}>Logout</button>
              )}
            </div>
          </div>
        ) : (
          <>
            <ul className="navbar-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/exams">Exams</Link></li>
              <li><Link to="/resources">Resources</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to='/checkresult'> Results </Link></li>
            </ul>
            <div className="navbar-buttons">
              {!isLoggedIn && (
                <button className="login-btn" onClick={handleLogin}>Login</button>
              )}
              {isLoggedIn && (
                <button className="getstarted-btn" onClick={handleLogout}>Logout</button>
              )}
            </div>
          </>
        )}
      </nav>
    </>
  );
};

export default Navbar;
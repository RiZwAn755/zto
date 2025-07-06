import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebook, FaWhatsapp,FaLinkedin  } from 'react-icons/fa';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-left">
          <img src="/ZTO_LOG_FINAL.png" alt="Logo" className="logo" />
          <p>© ZTO, Inc. 2025. Avid Learners</p>
        </div>

        <div className="footer-center">
          <div>
            <h4>Community</h4>
            <p>Our Team</p>
            <p>Your Portal</p>
            <p>Live events</p>
          </div>
          <div>
            <h4>Company</h4>
            <p>About us</p>
            <p>Careers</p>
            <p>Contact us</p>
            <p>History</p>
          </div>
          <div className="footer-right">
            <Link className="btn-register" to ="/login">Register</Link>
            <Link className="btn-outline" to="/login">Log In</Link>
            <Link className="btn-outline" to = "/login">ADMIN</Link>
          </div>
        </div>
      </div>

      <hr />

      <div className="footer-bottom">
        <p>Follow us:</p>
        <br />
        <div className="social-icons">
          <a href="https://www.linkedin.com/in/mdrzwn001" target="_blank" rel="noopener noreferrer" className="social-link">
            <FaLinkedin size={30} color="#0e76a8" />
          </a>
          <a href="https://www.facebook.com/yourusername" target="_blank" rel="noopener noreferrer" className="social-link">
            <FaFacebook size={30} color="#1877F2" />
          </a>
          <a href="https://www.instagram.com/mdrzwn001" target="_blank" rel="noopener noreferrer" className="social-link">
            <FaInstagram size={30} color="#E4405F" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
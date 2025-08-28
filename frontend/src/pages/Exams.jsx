import React from 'react';
import './Exams.css'; 
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { useNavigate } from 'react-router-dom';

const Exams = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
     
      <div className="exams-container">
        <div 
          className="small-card rewards-card"
       
        >
          <div className="card-icon">🏆</div>
          <h3>Upcoming Exams</h3>
          <p>Know more about All Upcoming exams from ZTO</p>
          <button 
            className="card-button"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/UpcomingExams');
            }}
          >
           Know More
          </button>
        </div>
        

      
    <div className="card-container">
      
      <div className="card-row">
        {/* Enroll Exams Card */}
        <div 
          className="small-card enroll-card"
          onClick={() => navigate('/enroll-exams')}
        >
          <div className="card-icon">📝</div>
          <h3>Enroll Exams</h3>
          <p>Register for upcoming examinations and secure your spot for the tests</p>
          <button 
            className="card-button"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/enroll-exams');
            }}
          >
            Enroll Now
          </button>
        </div>
        
        {/* Rewards Card */}
        <div 
          className="small-card rewards-card"
          // onClick={() => navigate('/rewards')}
        >
          <div className="card-icon">🏆</div>
          <h3>Your Rewards</h3>
          <p>View your achievements, badges, and earned rewards</p>
          <button 
            className="card-button"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/rewards');
            }}
          >
            View Rewards
          </button>
        </div>
        
        {/* Results Card */}
       
      </div>
      
      {/* Past Exams Card */}
      <div 
        className="full-width-card"
        // onClick={() => navigate('/past-exams')}
      >
        <div className="full-card-content">
          <div className="full-card-text">
            <h2>Past Exam History</h2>
            <p>Review all your previous examinations, scores, and performance trends over time</p>
          </div>
          <button 
            className="card-button full-width-button"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/PastExams');
            }}
          >
            View Complete History
          </button>
        </div>
      </div>
    </div>
      <Footer />
    </div>
    </>
  );
  
};

export default Exams;
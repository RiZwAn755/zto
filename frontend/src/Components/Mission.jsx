import React from 'react';
import './Mission.css';
import { useNavigate } from 'react-router';


const MissionSection = () => {
  const navigate = useNavigate();
  const handleExploreClick = (e) => {
   e.preventDefault();
   navigate('/exams');
  };
  return (
    <section className="mission-container">
      <div className="mission-row">
        <div className="mission-left">
          <h2 className="mission-title">MISSION ZONAL TALENT OLYMPIAD</h2>
          <p className="mission-text">
            At ZTO, we are on a mission to bridge the educational gap in rural communities by creating a unified platform for opportunity and excellence.<br/>
            We conduct competitive exams to identify talented students, provide them with personalized mentorship, and offer scholarships that empower them to pursue their dreams.
          </p>
          <p className="mission-text">
            Through expert-led training, structured guidance, and a nurturing environment, we help students unlock their full potential — preparing them not just for exams, but for life.
          </p>
          <p className="mission-highlight"><b>Your journey to success starts here — let ZTO be your guide.</b></p>
        </div>
        <div className="mission-right">
          <img src="/SchoolBag.jpg" alt="Mission ZTO" className="mission-image" />
        </div>
      </div>
      <div className="mission-button-wrapper">
        <button className="mission-button" onClick={handleExploreClick}>Explore and Register</button>
      </div>
    </section>
  );
};

export default MissionSection;
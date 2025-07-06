import React from 'react';
import Navbar from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import './Rewards.css';
import Footer from '../Components/Footer';

const Rewards = () => {
  const navigate = useNavigate();
  
  const badges = [
    { id: 1, name: 'Fast Learner', icon: '🚀', earned: true, date: 'Sep 10, 2023', points: 200 },
    { id: 2, name: 'Top Performer', icon: '🏆', earned: true, date: 'Oct 5, 2023', points: 500 },
    { id: 3, name: 'Perfect Score', icon: '💯', earned: true, date: 'Oct 22, 2023', points: 300 },
    { id: 4, name: 'Exam Master', icon: '👑', earned: false, points: 1000 },
    { id: 5, name: 'Streak Champion', icon: '🔥', earned: false, points: 800 },
  ];

  return (
    <>
    <Navbar />
    <div className="rewards-container">
      <header className="rewards-header">
        <button className="rewards-back-btn" onClick={() => navigate(-1)}>
          <span className="arrow-icon">←</span> Back to Dashboard
        </button>
        <div className="header-content">
          <h1>Your Achievement Center</h1>
          <p>Celebrate your learning milestones and track progress</p>
        </div>
      </header>

      <div className="stats-panel">
        <div className="stat-card">
          <h3>Total Points</h3>
          <p className="stat-value">1,000</p>
        </div>
        <div className="stat-card">
          <h3>Badges Earned</h3>
          <p className="stat-value">3</p>
        </div>
        <div className="stat-card">
          <h3>Current Level</h3>
          <p className="stat-value">Silver</p>
        </div>
      </div>

      <section className="badges-section">
        <h2 className="section-title">Your Badges</h2>
        <div className="badges-grid">
          {badges.filter(b => b.earned).map(badge => (
            <div key={badge.id} className="badge-card earned">
              <div className="badge-icon">{badge.icon}</div>
              <h3>{badge.name}</h3>
              <p className="badge-date">Earned: {badge.date}</p>
              <div className="points-bubble">{badge.points} pts</div>
            </div>
          ))}
        </div>
      </section>

      <section className="badges-section">
        <h2 className="section-title">Next Challenges</h2>
        <p className="section-subtitle">Keep going to unlock these!</p>
        <div className="badges-grid">
          {badges.filter(b => !b.earned).map(badge => (
            <div key={badge.id} className="badge-card locked">
              <div className="badge-icon">{badge.icon}</div>
              <h3>{badge.name}</h3>
              <div className="points-required">{badge.points} points needed</div>
            </div>
          ))}
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
};

export default Rewards;
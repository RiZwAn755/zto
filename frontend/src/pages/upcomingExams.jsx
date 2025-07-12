import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import './upcomingExams.css';

const upcomingExams = [
  {
    id: 1,
    title: "Mathematics Olympiad 2024",
    date: "2024-04-15T09:00:00",
    deadline: "2024-04-05",
    description: "Advanced problem-solving competition for grades 9-12",
    level: "National",
    subject: "Math",
    prize: "₹1,00,000",
    registered: 1245,
    capacity: 2000
  },
  {
    id: 2,
    title: "Science Talent Search",
    date: "2024-05-22T10:30:00",
    deadline: "2024-05-10",
    description: "Physics, Chemistry, and Biology challenge",
    level: "Zonal",
    subject: "Science",
    prize: "₹75,000",
    registered: 876,
    capacity: 1500
  },
  {
    id: 3,
    title: "English Mastery Challenge",
    date: "2024-06-08T13:00:00",
    deadline: "2024-05-28",
    description: "Literature and language skills competition",
    level: "Regional",
    subject: "English",
    prize: "₹50,000",
    registered: 532,
    capacity: 1000
  },
  {
    id: 4,
    title: "Computer Science Hackathon",
    date: "2024-07-12T11:00:00",
    deadline: "2024-06-30",
    description: "Coding and algorithm competition",
    level: "National",
    subject: "CS",
    prize: "₹1,20,000",
    registered: 987,
    capacity: 1500
  },
];

const UpcomingExams = () => {
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const filteredExams = upcomingExams
    .filter(exam => filter === 'All' || exam.level === filter)
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'level') return a.level.localeCompare(b.level);
      return 0;
    });

  return (
    <div className="upcoming-exams-page">
      <Navbar />
      <div className="upcoming-exams-container">
        <div className="header-content" style={{ marginTop: "50px" }}>
          <h2 className="upcoming-exams-title">Upcoming Olympiad Exams</h2>
          <p className="subtitle">Register now for these prestigious academic competitions</p>
          
          <div className="countdown-banner">
            <h3>Next Exam: {upcomingExams[0].title}</h3>
            <div className="countdown-timer">
              <span className="countdown-unit">
                <span className="number">{getDaysRemaining(upcomingExams[0].date)}</span>
                <span className="label">Days</span>
              </span>
              <span className="countdown-unit">
                <span className="number">{formatTime(upcomingExams[0].date)}</span>
                <span className="label">Time</span>
              </span>
            </div>
          </div>

          <div className="controls">
            <div className="filter-control">
              <label htmlFor="filter">Filter by:</label>
              <select 
                id="filter" 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All Levels</option>
                <option value="National">National</option>
                <option value="Zonal">Zonal</option>
                <option value="Regional">Regional</option>
              </select>
            </div>

            <div className="sort-control">
              <label htmlFor="sort">Sort by:</label>
              <select 
                id="sort" 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Date</option>
                <option value="title">Name</option>
                <option value="level">Level</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="upcoming-exams-grid">
          {filteredExams.map((exam) => {
            const daysUntilDeadline = getDaysRemaining(exam.deadline);
            const registrationProgress = Math.min(100, (exam.registered / exam.capacity) * 100);
            
            return (
              <div className={`upcoming-exam-card ${exam.subject.toLowerCase()}`} key={exam.id}>
                <div className="card-header">
                  <span className={`subject-badge ${exam.subject.toLowerCase()}`}>
                    {exam.subject}
                  </span>
                  <span className={`level-badge ${exam.level.toLowerCase()}`}>
                    {exam.level}
                  </span>
                </div>

                <div className="card-content">
                  <h3>{exam.title}</h3>
                  <div className="exam-date-time">
                    <span className="date">
                      <i className="far fa-calendar-alt"></i> {formatDate(exam.date)}
                    </span>
                    <span className="time">
                      <i className="far fa-clock"></i> {formatTime(exam.date)}
                    </span>
                  </div>
                  <p className="exam-description">{exam.description}</p>
                  
                  <div className="exam-prize">
                    <i className="fas fa-trophy"></i> Prize: <span className="prize-amount">{exam.prize}</span>
                  </div>

                  <div className="registration-info">
                    <div className="deadline-warning">
                      <i className="far fa-bell"></i> Registration closes in {daysUntilDeadline} days
                      {daysUntilDeadline <= 7 && (
                        <span className="urgent-badge">Hurry!</span>
                      )}
                    </div>
                    <div className="progress-container">
                      <div 
                        className="progress-bar" 
                        style={{ width: `${registrationProgress}%` }}
                      ></div>
                      <span className="progress-text">
                        {exam.registered}/{exam.capacity} registered ({Math.round(registrationProgress)}%)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <button className="register-button">
                    <i className="fas fa-edit"></i> Register Now
                  </button>
                  <button className="details-button">
                    <i className="fas fa-info-circle"></i> Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredExams.length === 0 && (
          <div className="no-results">
            <p>No upcoming exams match your filters.</p>
          </div>
        )}

        <div className="upcoming-cta">
          <h3>Interested in more competitions?</h3>
          <p>Join our newsletter to stay updated on all upcoming olympiads</p>
          <div className="cta-actions">
            <button className="cta-button primary">
              <i className="far fa-envelope"></i> Subscribe
            </button>
            <button className="cta-button secondary">
              <i className="fas fa-calendar-alt"></i> View Full Calendar
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UpcomingExams;
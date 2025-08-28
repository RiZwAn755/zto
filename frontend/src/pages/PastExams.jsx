import React from 'react';
import Navbar from '../Components/Navbar';   
import Footer from '../Components/Footer';  
import './PastExams.css';

const pastExams = [
  {
    title: "Mathematics Final Exam 2024",
    date: "March 15, 2024",
    description: "Algebra, Calculus, Trigonometry and Geometry combined exam for Grade 10.",
  },
  {
    title: "Science Midterm 2023",
    date: "November 10, 2023",
    description: "Physics, Chemistry and Biology midterm paper for Grade 9.",
  },
  {
    title: "English Literature Test",
    date: "September 5, 2023",
    description: "Poetry, Prose, and Grammar evaluation for Grade 8.",
  },
  {
    title: "National Science Olympiad",
    date: "August 20, 2023",
    description: "All India level Science Olympiad Exam for 6th to 10th grades.",
  },
];

const PastExams = () => {
  return (
    <div>
      <Navbar />
      <div className="past-exams-container">
        <h2 className="past-exams-title">Past Exams</h2>
        <div className="past-exams-grid">
          {pastExams.map((exam, index) => (
            <div className="past-exam-card" key={index}>
              <h3>{exam.title}</h3>
              <p className="exam-date">{exam.date}</p>
              <p className="exam-description">{exam.description}</p>
              <button className="view-button">View Details</button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PastExams;
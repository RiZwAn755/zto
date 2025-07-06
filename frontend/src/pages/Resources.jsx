import React, { useState } from 'react';
import './Resources.css';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { useNavigate } from 'react-router';
import AskAI from '../Components/Doubt_Assistant';

const Resources = () => {
  const [activeTab, setActiveTab] = useState('grades');
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const grades = ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
  const subjects = ["Physics", "Chemistry", "Maths", "English", "Biology"];
  const samplePapers = ["2023 Papers", "2022 Papers", "2021 Papers", "Model Papers"];

  const navigate = useNavigate();

  const handleDoubt = (e) => {
      
    e.preventDefault();
    navigate('/AskAI');
  }

  return (
    <>
      <Navbar />
      <button className='doubtButton-fixed' onClick={handleDoubt}>Doubts ?</button>
      <div className="resources-container">
        <div className="resources-header">
          <h1>PYQ and Sample Papers</h1>
          <p className="resources-subheading">ZTO: All Grades. All Subjects. One Place.</p>
        </div>

        <div className="resources-tabs">
          <button 
            className={`tab-btn ${activeTab === 'grades' ? 'active' : ''}`}
            onClick={() => setActiveTab('grades')}
          >
            By Grade
          </button>
          <button 
            className={`tab-btn ${activeTab === 'subjects' ? 'active' : ''}`}
            onClick={() => setActiveTab('subjects')}
          >
            By Subject
          </button>
          <button 
            className={`tab-btn ${activeTab === 'samples' ? 'active' : ''}`}
            onClick={() => setActiveTab('samples')}
          >
            Sample Papers
          </button>
        </div>

        <div className="resources-content">
          {activeTab === 'grades' && (
            <div className="grade-selector">
              <h2>Select Your Grade</h2>
              <div className="grade-buttons">
                {grades.map(grade => (
                  <button
                    key={grade}
                    className={`grade-btn ${selectedGrade === grade ? 'selected' : ''}`}
                    onClick={() => setSelectedGrade(grade)}
                  >
                    {grade}
                  </button>
                ))}
              </div>
              
              {selectedGrade && (
                <div className="subject-selection">
                  <h3>Subjects for {selectedGrade}</h3>
                  <div className="subject-grid">
                    {subjects.map(subject => (
                      <div 
                        key={subject}
                        className="subject-card"
                        onClick={() => setSelectedSubject(subject)}
                      >
                        <div className="subject-icon">{subject.charAt(0)}</div>
                        <h4>{subject}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'subjects' && (
            <div className="subject-selector">
              <h2>Browse By Subject</h2>
              <div className="subject-grid">
                {subjects.map(subject => (
                  <div key={subject} className="subject-card-wide">
                    <h3>{subject}</h3>
                    <div className="grade-buttons">
                      {grades.map(grade => (
                        <button
                          key={`${subject}-${grade}`}
                          className="grade-chip"
                        >
                          {grade.split(' ')[1]}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'samples' && (
            <div className="sample-papers">
              <h2>Sample Papers</h2>
              <div className="paper-grid">
                {samplePapers.map(paper => (
                  <div key={paper} className="paper-card">
                    <div className="paper-icon">📄</div>
                    <h3>{paper}</h3>
                    <button className="download-btn">Download</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Resources;
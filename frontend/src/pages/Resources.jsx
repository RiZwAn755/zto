import React, { useState } from 'react';
import './Resources.css';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { useNavigate } from 'react-router';
import AskAI from '../Components/Doubt_Assistant';

const Resources = () => {
  const [activeTab, setActiveTab] = useState('grades');
  const [selectedGrade, setSelectedGrade] = useState(6);
  const [selectedSubject, setSelectedSubject] = useState(null);

 const handleSample = (paper)=> (e) => {
    e.preventDefault();
    navigate(`${paper}`);

 }

const  handleSubject = (subject, grade) => (e) => {
    e.preventDefault();
    subject = subject.toLowerCase();
    const url = `https://bit.ly/${subject}__${grade}`;
    console.log(url);
    window.open(url);
 
}

  const grades = [6, 7, 8 , 9, 10, 11, 12];
  const subjects = ["Physics", "Chemistry", "Maths", "English", "Biology"];
  const subjectsSmall = ["Science", "Maths", "English"];
  const samplePapers = [ 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];

  const navigate = useNavigate();

 

  return (
    <>
      <Navbar />
      <div className="resources-container" style={{ paddingTop: 100 }}>
        <div className="resources-header">
          <h1>PYQ and Sample Papers</h1>
          <p className="resources-subheading">ZTO: All Grades. All Subjects. One Place.</p>
        </div>

        <div className="resources-tabs">
          <button 
            className={`tab-btn ${activeTab === 'grades' ? 'active' : ''}`}
            onClick={() => setActiveTab('grades')}
          >
            Class-wise Resources
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
              
              {selectedGrade <= 10 ?  (
                <div className="subject-selection">
                  <h3>Subjects for {selectedGrade}</h3>
                  <div className="subject-grid">
                    {subjectsSmall.map(subject => (
                      <div 
                        key={subject}
                        className="subject-card"
                       onClick={handleSubject(subject, selectedGrade)}
                      >
                         
                        <div className="subject-icon" >{subject.charAt(0)}</div>
                        <h4>{subject}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              ): (<div className="subject-selection">
                  <h3>Subjects for {selectedGrade}</h3>
                  <div className="subject-grid" >
                    {subjects.map(subject => (
                      <div 
                        key={subject}
                        className="subject-card"
                       
                       onClick={handleSubject(subject, selectedGrade)}

                      >
                       
                        <div className="subject-icon"  >{subject.charAt(0)}</div>
                        <h4>{subject}</h4>
                         
                      </div>
                      
                    ))}
                  </div>
                </div>)}

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
                    
                    <button className="download-btn" onClick={handleSample(paper)} >Download</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <style>{`
        @media (max-width: 600px) {
          .resources-container {
            padding-top: 70px !important;
          }
        }
      `}</style>
    </>
  );
};

export default Resources;
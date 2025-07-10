import React from "react";
import { useLocation } from "react-router-dom";
import "./CheckResult.css";
import Navbar from "../Components/Navbar"; // Ensure correct import
import Footer from "../Components/Footer"; // Ensure correct import

const CheckResult = () => {
  const location = useLocation();
  const resultData = location.state?.resultData;

  if (!resultData) {
    return (
      <>
        <Navbar />
        <div style={{ paddingTop: 100 }}>
          <div className="result-container">
            <div className="no-result">No result data available.</div>
          </div>
        </div>
        <Footer />
        <style>{`
          @media (max-width: 600px) {
            div[style*='paddingTop: 100'] {
              padding-top: 70px !important;
            }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 100 }}>
        <div className="result-container">
          <div className="result-header">
            <h1>Exam Results</h1>
            <p>Access your examination results with detailed performance analysis</p>
          </div>

          <div className="result-details">
            <h2>{resultData.studentName}</h2>
            <p><strong>Roll Number:</strong> {resultData.rollNumber}</p>
            <p><strong>Course:</strong> {resultData.course}</p>
            <p><strong>Total Marks:</strong> {resultData.totalMarks}</p>
            <p><strong>Marks Obtained:</strong> {resultData.marksObtained}</p>
            <p><strong>Percentage:</strong> {resultData.percentage}%</p>
            <p><strong>Status:</strong> {resultData.status}</p>

            <div className="subject-analysis">
              <h3>Subject-wise Analysis</h3>
              <ul>
                {resultData.subjects.map((subject, index) => (
                  <li key={index}>
                    <span>{subject.name}</span>
                    <span>{subject.marks} / {subject.total}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <style>{`
        @media (max-width: 600px) {
          div[style*='paddingTop: 100'] {
            padding-top: 70px !important;
          }
        }
      `}</style>
    </>
  );
};

export default CheckResult;

import React, { useState, useEffect } from 'react';
import './ExamSection.css';
import DoubtButton from "./DoubtButton";
import { useNavigate } from 'react-router-dom';
import { FaSquareRootAlt, FaAtom, FaVial, FaDna, FaGlobeAmericas, FaPuzzlePiece } from 'react-icons/fa';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const categories = [
  { title: 'Primary Exam', color: '#E1F0FA', image: '/Exams_1.jpg' },
  { title: 'Competitive Exam', color: '#C8E0E7', image: '/Exams_1.jpg' },
  { title: 'BOARD EXAMS', color: '#B7E1DC', image: '/Exams_1.jpg' },
];

const subjects = [
  {
    name: 'Mathematics',
    icon: <FaSquareRootAlt className="subject-icon" style={{ color: '#3b82f6' }} />,
  },
  {
    name: 'Physics',
    icon: <FaAtom className="subject-icon" style={{ color: '#a21caf' }} />,
  },
  {
    name: 'Chemistry',
    icon: <FaVial className="subject-icon" style={{ color: '#f59e42' }} />,
  },
  {
    name: 'Biology',
    icon: <FaDna className="subject-icon" style={{ color: '#22c55e' }} />,
  },
  {
    name: 'General Awareness',
    icon: <FaGlobeAmericas className="subject-icon" style={{ color: '#fbbf24' }} />,
  },
  {
    name: 'Reasoning',
    icon: <FaPuzzlePiece className="subject-icon" style={{ color: '#ef4444' }} />,
  },
];

const baseUrl = import.meta.env.VITE_BASE_URL;

const ExamSection = () => {
  const navigate = useNavigate();
  const [displayCount, setDisplayCount] = useState(0);

  const fetchVisitorCount = async () => {
    const response = await axios.get(`${baseUrl}/students`);
    return response.data.length;
  };

  const {
    data: visitorCount = 0,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['students'],
    queryFn: fetchVisitorCount,
    staleTime: 60000,
  });

 
  useEffect(() => {
    if (displayCount === visitorCount) return;

    const increment =
      visitorCount > 100 ? Math.ceil(visitorCount / 50) : 1;

    const timer = setInterval(() => {
      setDisplayCount(prev => {
        if (prev + increment >= visitorCount) {
          clearInterval(timer);
          return visitorCount;
        }
        return prev + increment;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [visitorCount, displayCount]);

  return (
    <>
      <DoubtButton />

      <section className="exam-section" id="exam-section">
        <div className="active-users-wrapper">
          <div className="active-users">
            {isLoading && "Loading..."}
            {error && "Error loading visitors"}
            {!isLoading && !error && `Visitors count : ${displayCount}+`}
          </div>
        </div>

        <div className="exam-categories">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="exam-card"
              style={{ backgroundColor: cat.color }}
            >
              <button onClick={() => navigate('/exams')}>
                <img src={cat.image} alt={cat.title} />
              </button>
              <h4>{cat.title}</h4>
            </div>
          ))}
        </div>

        <div className="exam-explore">
          <div className="explore-heading">
            <h2>
              Explore Our Exam <br /> get Mentored
            </h2>
            <button
              className="explore-btn"
              onClick={() => navigate('/resources')}
            >
              EXPLORE ALL
            </button>
          </div>

          <div className="subject-grid">
            {subjects.map((_, i) => (
              <div key={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ExamSection;

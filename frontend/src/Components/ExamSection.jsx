import React, { useState, useEffect } from 'react';
import './ExamSection.css';
import { useNavigate } from 'react-router-dom';
import { FaSquareRootAlt, FaAtom, FaVial, FaDna, FaGlobeAmericas, FaPuzzlePiece } from 'react-icons/fa';
import { Typewriter } from 'react-simple-typewriter';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';

const categories = [
  { title: 'Primary Exam', color: '#E1F0FA', image: '/Exams_1.jpg' },
  { title: 'Competitive Exam', color: '#C8E0E7', image: '/Exams_1.jpg' },
  { title: 'BOARD EXAMS', color: '#B7E1DC', image: '/Exams_1.jpg' },
];

const subjects = [
  {
    name: 'Mathematics',
    quote: "Without mathematics, there's nothing you can do. Everything around you is mathematics. Everything around you is numbers.",
    author: '— Shakuntala Devi',
    icon: <FaSquareRootAlt className="subject-icon" style={{ color: '#3b82f6' }} />,
  },
  {
    name: 'Physics',
    quote: "Physics isn't the most important thing. Love is.",
    author: '— Richard Feynman',
    icon: <FaAtom className="subject-icon" style={{ color: '#a21caf' }} />,
  },
  {
    name: 'Chemistry',
    quote: "Chemistry is necessarily an experimental science: its conclusions are drawn from data, and its principles supported by evidence from facts.",
    author: '— Michael Faraday',
    icon: <FaVial className="subject-icon" style={{ color: '#f59e42' }} />,
  },
  {
    name: 'Biology',
    quote: "The greatest miracle on Earth is life itself.",
    author: '— Saurabh Yadav',
    icon: <FaDna className="subject-icon" style={{ color: '#22c55e' }} />,
  },
  {
    name: 'General Awareness',
    quote: "The greatest enemy of knowledge is not ignorance, it is the illusion of knowledge.",
    author: '— Stephen Hawking',
    icon: <FaGlobeAmericas className="subject-icon" style={{ color: '#fbbf24' }} />,
  },
  {
    name: 'Reasoning',
    quote: "It is not enough to have a good mind; the main thing is to use it well.",
    author: '— Rene Descartes',
    icon: <FaPuzzlePiece className="subject-icon" style={{ color: '#ef4444' }} />,
  },
];

const baseUrl = import.meta.env.VITE_BASE_URL ;

const ExamSection = () => {
  const navigate = useNavigate();
  const [visitorCount, setVisitorCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const response = await axios.get(`${baseUrl}/students`);
        if (response.data && Array.isArray(response.data)) {
          setVisitorCount(response.data.length);
        }
      } catch (error) {
        console.error('Error fetching visitor count:', error);
        setVisitorCount(0);
      }
    };

    fetchVisitorCount();
  }, []);

  // Animate the count-up effect
  useEffect(() => {
    if (displayCount === visitorCount) return;
    const increment = visitorCount > 100 ? Math.ceil(visitorCount / 50) : 1;
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
    <section className="exam-section" id="exam-section">
      <div className="active-users-wrapper">
        <div className="active-users"> Visitors count : {displayCount}+</div>
      </div>

      <div className="exam-categories">
        {categories.map((cat, i) => (
          <div key={i} className="exam-card" style={{ backgroundColor: cat.color }}>
            <button onClick={() => navigate('/exams')}>
              <img src={cat.image} alt={cat.title} />
            </button>
            <h4>{cat.title}</h4>
          </div>
        ))}
      </div>

      <div className="exam-explore">
        <div className="explore-heading">
          <h2>Explore Our Exam to <br />get Mentored</h2>
          <button className="explore-btn" onClick={() => navigate('/resources')}>EXPLORE ALL</button>
        </div>

        <div className="subject-grid">
          {subjects.map((sub, idx) => {
            const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
            return (
              <div key={idx} className="subject-card" ref={ref}>
                {sub.icon}
                <h4>{sub.name}</h4>
                <p className="subject-quote">
                  {inView ? (
                    <Typewriter
                      words={[sub.quote]}
                      typeSpeed={28}
                      cursor
                      cursorStyle="|"
                    />
                  ) : ''}
                </p>
                <p className="subject-author">{sub.author}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExamSection;
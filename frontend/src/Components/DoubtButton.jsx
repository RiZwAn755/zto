import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DoubtButton.css';

const DoubtButton = () => {
  const navigate = useNavigate();
  const handleDoubt = (e) => {
    e.preventDefault();
    navigate('/AskAI');
  };
  return (
    <button className='doubtButton-fixed' onClick={handleDoubt}>
      <span className="chatbot-icon" role="img" aria-label="chat">💬</span>
      <span className="chatbot-label">Doubts</span>
    </button>
  );
};

export default DoubtButton; 
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DoubtButton.css';

const DoubtButton = () => {
  const navigate = useNavigate();
  // Set default position: bottom right for mobile, bottom right for desktop
  const getDefaultPosition = () => {
    if (window.innerWidth <= 600) {
      return { left: window.innerWidth - 72, top: window.innerHeight - 72 };
    }
    return { left: window.innerWidth - 102, top: window.innerHeight - 102 };
  };
  const [position, setPosition] = useState(getDefaultPosition());
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Update position on resize (to keep button visible)
  useEffect(() => {
    const handleResize = () => {
      setPosition(getDefaultPosition());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse/touch down
  const handleDragStart = (e) => {
    e.stopPropagation();
    setDragging(true);
    let clientX, clientY;
    if (e.type === 'touchstart') {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    dragOffset.current = {
      x: clientX - position.left,
      y: clientY - position.top
    };
    document.body.style.userSelect = 'none';
  };

  // Mouse/touch move
  const handleDrag = (e) => {
    if (!dragging) return;
    let clientX, clientY;
    if (e.type === 'touchmove') {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const btn = document.getElementById('draggable-doubt-btn');
    const btnRect = btn ? btn.getBoundingClientRect() : { width: 70, height: 70 };
    const viewport = { width: window.innerWidth, height: window.innerHeight };
    let newLeft = clientX - dragOffset.current.x;
    let newTop = clientY - dragOffset.current.y;
    // Clamp to viewport
    newLeft = Math.max(0, Math.min(newLeft, viewport.width - btnRect.width));
    newTop = Math.max(0, Math.min(newTop, viewport.height - btnRect.height));
    setPosition({ left: newLeft, top: newTop });
  };

  // Mouse/touch up
  const handleDragEnd = () => {
    setDragging(false);
    document.body.style.userSelect = '';
  };

  // Attach/detach listeners
  React.useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDrag, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
    } else {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDrag);
      window.removeEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDrag);
      window.removeEventListener('touchend', handleDragEnd);
    };
    // eslint-disable-next-line
  }, [dragging]);

  const handleDoubt = (e) => {
    if (!dragging) {
      e.preventDefault();
      navigate('/AskAI');
    }
  };

  return (
    <button
      id="draggable-doubt-btn"
      className='doubtButton-fixed'
      style={{
        left: position.left,
        top: position.top,
        right: 'auto',
        bottom: 'auto',
        touchAction: 'none',
        position: 'fixed',
        zIndex: 1000
      }}
      onClick={handleDoubt}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      aria-label="Ask Doubt"
    >
      <span className="chatbot-icon" role="img" aria-label="chat">💬</span>
      <span className="chatbot-label">Doubts</span>
    </button>
  );
};

export default DoubtButton; 
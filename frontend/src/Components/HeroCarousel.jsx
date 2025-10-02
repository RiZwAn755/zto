import React, { useEffect, useState } from 'react';
import './HeroCarousel.css';

const slides = [
  {
    id: 1,

    image: '/img1.jpg',
    title: 'Empower Your Learning',
    subtitle: 'Discover endless resources and boost your knowledge.',
    bgColor: '#6a5acd',
   heigh: '300px',
   width:'500px'
  },
  {
    id: 2,
    image: '/logo.jpg',

    title: 'Connect & Collaborate',
    subtitle: 'Join a community of innovators and creators.',
    bgColor: '#6a5acd',
  },
  {
    id: 3,

    image: '/image.png',

    title: 'Build Something Amazing',
    subtitle: 'Turn your ideas into reality with powerful tools.',
    bgColor: '#6a5acd',
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="carousel-wrapper" style={{ backgroundColor: slides[current].bgColor }}>
      <div className="carousel-slide">

        <img src={slides[current].image} alt={`Slide ${current}`}  />
        <div className="carousel-text">
          <h1>{slides[current].title}</h1>
          <p style={{color:"white"}}>{slides[current].subtitle }</p>

        </div>
      </div>

      <div className="carousel-dots">
        {slides.map((_, idx) => (
          <span
            key={idx}

            className={`dot ${current === idx ? 'active' : ''}`}

            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;


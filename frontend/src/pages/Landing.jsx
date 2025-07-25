import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";

const Landing = () => {
  const [studentAnimation, setStudentAnimation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/student-cartoon.json")
      .then(res => res.json())
      .then(setStudentAnimation);
  }, []);

  return (
    <>
      <Navbar />

      {/* Decorative blurred shape */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 400,
        zIndex: 0,
        background: 'radial-gradient(circle at 60% 40%, #fff 0%, #2b4eff22 60%, transparent 100%)',
        filter: 'blur(32px)',
        opacity: 0.7,
      }} />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 12px 32px 12px', position: 'relative', zIndex: 1, paddingTop: 80 }}>
        <section style={{
          background: 'rgba(255,255,255,0.98)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(43,78,255,0.13)',
          maxWidth: 500,
          width: '100%',
          padding: '18px 32px 14px 32px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          minHeight: 260,
        }}>
          {/* Tagline badge */}
          <span style={{
            display: 'inline-block',
            background: 'linear-gradient(90deg, #2b4eff 60%, #6a5acd 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '6px 20px',
            marginBottom: 18,
            letterSpacing: 1,
            fontWeight: 700,
            fontSize: 14,
            boxShadow: '0 2px 8px #2b4eff22',
            textTransform: 'uppercase',
            textShadow: '0 1px 8px #2b4eff33',
          }}>
            India's Fastest Growing Student Platform
          </span>
          {studentAnimation && (
            <Lottie
              animationData={studentAnimation}
              loop
              style={{ width: 300, height: 320, margin: "0 auto 12px auto" }}
            />
          )}
          <h1 style={{ fontSize: 38, fontWeight: 900, color: '#2b4eff', marginBottom: 18, letterSpacing: 0.5, lineHeight: 1.1 }}>
            Welcome to <span style={{ color: '#6a5acd' }}>ZTO</span>
          </h1>
          <p style={{ fontSize: 19, color: '#444', marginBottom: 36, fontWeight: 500, lineHeight: 1.5 }}>
            Empower your learning journey with resources, exams, and a vibrant community. Join thousands of students building their future with ZTO.
          </p>
          <button
            className="get-started-btn"
            onClick={() => navigate('/register')}
            style={{
              background: 'linear-gradient(90deg, #2b4eff 60%, #6a5acd 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              padding: '18px 48px',
              fontSize: 22,
              fontWeight: 800,
              boxShadow: '0 4px 24px #2b4eff33, 0 0 16px #6a5acd44',
              cursor: 'pointer',
              transition: 'background 0.2s, box-shadow 0.2s, transform 0.1s',
              marginTop: 8,
              outline: 'none',
              textShadow: '0 1px 8px #2b4eff33',
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Get Started
          </button>
        </section>
      </main>
      <Footer />
      {/* Responsive style */}
      <style>{`
        @media (max-width: 600px) {
          main {
            padding-top: 70px !important;
          }
          section {
            padding: 10px 2px 8px 2px !important;
            border-radius: 14px !important;
            max-width: 98vw !important;
            min-height: 120px !important;
          }
          h1 {
            font-size: 1.5rem !important;
          }
          p {
            font-size: 1.05rem !important;
          }
          .get-started-btn {
            font-size: 1.1rem !important;
            padding: 14px 18vw !important;
          }
        }
      `}</style>
    </>
  );
};

export default Landing;
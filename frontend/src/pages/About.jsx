import './About.css';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { useCallback } from 'react';

const About = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <>
      <Navbar />
      
      <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', paddingTop: 80 }}>
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fullScreen: { enable: false },
            background: { color: { value: '#fafbfc' } },
            fpsLimit: 60,
            interactivity: {
              events: {
                onHover: { enable: true, mode: 'grab' },
                resize: true,
              },
              modes: {
                grab: {
                  distance: 180,
                  line_linked: { opacity: 0.5 },
                },
                repulse: { distance: 100, duration: 0.4 },
              },
            },
            particles: {
              color: { value: '#4e4cf4' },
              links: {
                color: '#4e4cf4',
                distance: 140,
                enable: true,
                opacity: 0.25,
                width: 1.2,
              },
              move: {
                enable: true,
                speed: 1.1,
                direction: 'none',
                outModes: { default: 'out' },
                random: false,
                straight: false,
              },
              number: { value: 60, density: { enable: true, area: 900 } },
              opacity: { value: 0.35 },
              shape: { type: 'circle' },
              size: { value: { min: 1, max: 3.5 } },
            },
            detectRetina: true,
          }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
        />
        <div className="about-main-container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="aboutpage-title" style={{textAlign:"center", marginBottom:"50px"}}>About Us</h1>
     

          {/* Mission Section */}
          <div className="about-flex-section alt-reverse">
            <div className="about-content-box">
              <h2 className="about-content-title">MISSION ZONAL TALENT OLYMPIAD</h2>
              <div className="about-content-text">
                <p>At ZTO, we are on a mission to bridge the educational gap in rural communities by creating a unified platform for opportunity and excellence.<br/>
                We conduct competitive exams to identify talented students, provide them with personalized mentorship, and offer scholarships that empower them to pursue their dreams.</p>
                <p>Through expert-led training, structured guidance, and a nurturing environment, we help students unlock their full potential — preparing them not just for exams, but for life.</p>
                <p><b>Your journey to success starts here — let ZTO be your guide.</b></p>
              </div>
            </div>
            <div className="about-image-box">
              <img src="/mission.jpg" alt="Mission" className="about-main-image" style={{marginTop:"30px"}} />
            </div>
          </div>

          {/* History Section */}
          <div className="about-flex-section alt-normal">
            <div className="about-image-box">
              <img src="/history.jpg" alt="History" className="about-main-image" style={{height:"240px" , marginTop:"30px"} } />
            </div>
            <div className="about-content-box">
              <h2 className="about-content-title">History</h2>
              <div className="about-content-text">
                <p>We held our first ZTO exam in 2018, and it was a big success. Many students took part, and everything went smoothly because our team worked hard. After a short break, we brought the Olympiad back in 2025. This time, even more students joined, and we made sure the event was well-organized and fair for everyone. Our team's dedication helped make both events great experiences for all the students.</p>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="about-flex-section alt-normal">
            <div className="about-image-box">
              <img src="/benifits.jpg" alt="Benefits" className="about-main-image" style={{height:"240px" , marginTop:"30px"} }  />
            </div>
            <div className="about-content-box">
              <h2 className="about-content-title">Benefits</h2>
              <div className="about-content-text">
                <p>ZTO gives students a special chance to show their skills and be recognized for their hard work. By taking part, students can win awards, learn new things, and meet other talented students. We make sure our exams are fair and helpful, so every student can learn, grow, and feel proud of what they achieve.</p>
              </div>
            </div>
          </div>

          {/* Founders Section */}
          <div className="about-flex-section alt-reverse">
            <div className="about-content-box">
              <h2 className="about-content-title">Our Founders</h2>
              <div className="about-content-text">
                <p>ZTO was started by four friends: Mohammad Farhan (Software Engineer), Ashish Maurya (DevOps Engineer), Mohammad Rizwan (Electronics Engineer), and Saurabh Yadav (IT Engineer). All of them grew up in small towns, so they understood the problems and challenges that students from these areas face. They saw that many talented students were missing out on good opportunities. That's why they decided to create ZTO—to help students like themselves get a fair chance to learn, grow, and succeed.</p>
              </div>
            </div>
            <div className="about-image-box">
              <img src="/founder.jpg" alt="Founders" className="about-main-image" style={{marginTop:"30px"}}/>
            </div>
          </div>

          <hr className="about-divider" />
        </div>
      </div>
      <Footer />
      <style>{`
        @media (max-width: 600px) {
          .about-main-container, div[style*='minHeight: 100vh'] {
            padding-top: 70px !important;
          }
        }
      `}</style>
    </>
  );
};

export default About;
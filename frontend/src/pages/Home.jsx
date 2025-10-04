import Navbar from "../components/navbar.js";
import HeroCarousel from '../components/herocarousel';
import ExamSection from "../components/examsection";
import MissionSection from "../components/mission.jsx";
import Footer from "../components/footer.js";
import OurTeams from "../components/ourteams.jsx";
import HomeArticles from "./homearticle.jsx";


const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <HeroCarousel />
      <HomeArticles/>
      <ExamSection />
      <MissionSection />
      <OurTeams />
      <Footer />
      <style>{`
        .home-container {
          padding-top: 80px;
        }
        
        @media (max-width: 768px) {
          .home-container {
            padding-top: 70px;
          }
        }
        
        @media (max-width: 480px) {
          .home-container {
            padding-top: 60px;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
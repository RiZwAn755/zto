import Navbar from "../components/navbar";
import HeroCarousel from '../components/herocarousel.jsx';
import ExamSection from "../components/examsection";
import MissionSection from "../components/mission";
import Footer from "../components/footer";
import OurTeams from "../components/ourteams";
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
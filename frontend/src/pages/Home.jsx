import Navbar from "../Components/Navbar";
import HeroCarousel from "../Components/HeroCarousel";
import ExamSection from "../Components/ExamSection";
import MissionSection from "../Components/Mission";
import Footer from "../Components/Footer";
import OurTeams from "../Components/OurTeams";

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <HeroCarousel />
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
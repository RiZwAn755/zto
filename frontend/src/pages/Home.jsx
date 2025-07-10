import Navbar from "../Components/Navbar";
import HeroCarousel from "../Components/HeroCarousel";
import ExamSection from "../Components/ExamSection";
import MissionSection from "../Components/Mission";
import Footer from "../Components/Footer";
import OurTeams from "../Components/OurTeams";

const Home = () => {
  return (
    <div style={{ paddingTop: 80 }}>
      <Navbar />
      <HeroCarousel />
      <ExamSection />
      <MissionSection />
      <OurTeams />
      <Footer />
      <style>{`
        @media (max-width: 600px) {
          div {
            padding-top: 70px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
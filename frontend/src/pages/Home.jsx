import Navbar from "../Components/Navbar";
import HeroCarousel from "../Components/HeroCarousel";
import ExamSection from "../Components/ExamSection";
import MissionSection from "../Components/Mission";
import Footer from "../Components/Footer";
import OurTeams from "../Components/OurTeams";

const Home = () => {
  return (
    <div>
      <Navbar />
      <HeroCarousel />
      <ExamSection />
      <MissionSection />
      <OurTeams />
      <Footer />
    </div>
  );
};

export default Home;
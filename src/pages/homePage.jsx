import NavbarHome from "../components/home/NavbarHome";
import SectionComponent from "../components/home/SectionComponent";
import AboutSection from "../components/home/AboutSection";
import FaqSection from "../components/home/FaqSection";
import LearningSection from "../components/home/LearningSection";
import FooterSection from "../components/home/FooterSection";

const HomePage = () => {
  return (
    <div>
      <NavbarHome />
      <SectionComponent />
      <AboutSection />
      <LearningSection />
      <FaqSection />
      <FooterSection />
    </div>
  )
}

export default HomePage;
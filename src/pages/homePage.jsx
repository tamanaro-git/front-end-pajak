import NavbarHome from "../components/home/NavbarHome";
import SectionComponent from "../components/home/SectionComponent";
import AboutSection from "../components/home/AboutSection";
import FaqSection from "../components/home/FaqSection";

const HomePage = () => {
  return (
    <>
      <NavbarHome />
      <SectionComponent />
      <AboutSection />
      <FaqSection />
    </>
  )
}
export default HomePage;
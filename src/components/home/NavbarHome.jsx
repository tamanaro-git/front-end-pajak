import { useState } from "react";
import { Link } from "react-router-dom";

const NavbarHome = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-primary-dark text-white px-4 md:px-6 py-4 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <img src="/images/1.png" width={120} alt="Pajax Logo" />

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2 rounded-md hover:bg-primary-dark"
          onClick={toggleMobileMenu}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop Navigation Menu */}
        <div className="hidden lg:flex items-center space-x-8">
          <Link to="/" className="hover:text-secondary">Home</Link>
          <Link to="/learning" className="hover:text-secondary">Learning</Link>
          <Link to="/news" className="hover:text-secondary">Spotlight</Link>
          {/* <Link to="/login" className="hover:text-secondary">Login</Link> */}
        </div>

        {/* Desktop Right Side Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* Language Selector */}
          <div className="relative">
            <button className="flex items-center space-x-1 hover:text-secondary">
              <span>ID</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <Link to="/login" className="hover:text-secondary bg-neutral-light text-primary-dark py-2 px-5 rounded-2xl">Log In</Link>

          <Link to="/register" className="bg-primary hover:bg-opacity-80 text-white px-6 py-2 rounded-full font-medium transition-colors">
            Daftar Sekarang
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-4 pb-4 border-t border-primary-dark pt-4">
          <div className="flex flex-col space-y-4">
            {/* Mobile Menu Items */}
            <a href="#" className="py-2 hover:text-secondary">Home</a>
            <a href="#" className="py-2 hover:text-secondary">Highlight</a>
            <a href="#" className="py-2 hover:text-secondary">Insight</a>
            <a href="#" className="py-2 hover:text-secondary">Login</a>

            <div className="pt-4 border-t border-primary-dark flex flex-col space-y-3">
              <button className="bg-primary-dark hover:bg-opacity-80 text-white px-6 py-3 rounded-full font-medium transition-colors w-full">
                Daftar Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarHome;

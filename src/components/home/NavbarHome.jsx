import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const NavbarHome = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          console.log('Parsed user:', user); // Debug
          
          // Check different possible user name properties
          const name = user.name || user.username || user.fullName || user.email || 'User';
          
          setIsLoggedIn(true);
          setUserName(name);
          console.log('User is logged in:', name); // Debug
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      } else {
        console.log('No token or user found'); // Debug
      }
    };

    checkAuth();

    // Listen for storage changes (when user logs in on another tab)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Function to get dashboard URL based on user role
  const getDashboardUrl = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return '/login';
    
    try {
      const user = JSON.parse(userStr);
      const role = user.role;
      
      // Route based on role
      if (role === 'user') {
        return '/admin/opinions';
      } else if (role === 'super-admin') {
        return '/admin/dashboard';
      } else if (role === 'admin-learning') {
        return '/admin/books';
      } else if (role === 'admin-news') {
        return '/admin/users-news';
      } else if (role === 'journalist') {
        return '/admin/news';
      } else if (role === 'editor-journalist') {
        return '/admin/verifications/news';
      } else if (role === 'editor-opinion') {
        return '/admin/verifications/opinions';
      } else {
        return '/admin/opinions'; // Default for unknown roles
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      return '/login';
    }
  };

  useEffect(() => {
    // Close user menu when clicking outside
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName("");
    setUserMenuOpen(false);
    navigate('/login');
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
          <Link to="/" className="hover:text-secondary">Beranda</Link>
                    <a href="/learning" target="_blank" className="py-2 hover:text-secondary" onClick={toggleMobileMenu}>
              Learning
            </a>
            <a href="/news" target="_blank" className="py-2 hover:text-secondary" onClick={toggleMobileMenu}>
              Spotlight
            </a>
        </div>

        {/* Desktop Right Side Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          {isLoggedIn ? (
            /* User Menu */
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 transition-colors"
              >
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">{userName}</span>
                <svg className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                  <Link
                    to={getDashboardUrl()}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span>Dashboard</span>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Keluar</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Login & Register Buttons */
            <>
              <Link to="/login" className="hover:text-secondary bg-neutral-light text-primary-dark py-2 px-5 rounded-2xl">
                Masuk
              </Link>

            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-4 pb-4 border-t border-white/20 pt-4">
          <div className="flex flex-col space-y-4">
            {/* Mobile Menu Items */}
            <Link to="/" className="py-2 hover:text-secondary" onClick={toggleMobileMenu}>
              Beranda
            </Link>
            <a href="/learning" target="_blank" className="py-2 hover:text-secondary" onClick={toggleMobileMenu}>
              Learning
            </a>
            <a href="/news" target="_blank" className="py-2 hover:text-secondary" onClick={toggleMobileMenu}>
              Spotlight
            </a>

            <div className="pt-4 border-t border-white/20 flex flex-col space-y-3">
              {isLoggedIn ? (
                /* User Info & Actions */
                <>
                  <div className="flex items-center space-x-3 py-2">
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">{userName}</span>
                  </div>
                  <Link
                    to={getDashboardUrl()}
                    className="bg-neutral-light text-primary-dark hover:bg-opacity-90 px-6 py-3 rounded-full font-medium transition-colors w-full text-center"
                    onClick={toggleMobileMenu}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-medium transition-colors w-full"
                  >
                    Keluar
                  </button>
                </>
              ) : (
                /* Login & Register Buttons */
                <>
                  <Link
                    to="/login"
                    className="bg-neutral-light text-primary-dark hover:bg-opacity-90 px-6 py-3 rounded-full font-medium transition-colors w-full text-center"
                    onClick={toggleMobileMenu}
                  >
                    Masuk
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarHome;

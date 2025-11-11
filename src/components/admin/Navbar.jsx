// filepath: /home/zarif/Project/taxmin/front-end/src/components/admin/Navbar.jsx

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-30">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Mobile Menu Button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-primary hover:bg-neutral-light p-2 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Center/Left: Page Title or Search */}
          <div className="flex-1 lg:ml-0 ml-4">
            <h2 className="text-xl font-bold text-primary">Dashboard</h2>
          </div>

          {/* Right: Notifications & Profile */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-secondary hover:bg-neutral-light rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button className="flex items-center space-x-2 p-2 hover:bg-neutral-light rounded-lg transition-colors">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
                <span className="hidden md:block text-sm font-medium text-primary">Admin</span>
                <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
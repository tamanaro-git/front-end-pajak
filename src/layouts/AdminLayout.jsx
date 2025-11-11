// filepath: /home/zarif/Project/taxmin/front-end/src/layouts/AdminLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import Navbar from "../components/admin/Navbar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-neutral-light overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
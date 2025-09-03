import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

/**
 * AdminLayout - Main layout component for admin pages
 * Provides consistent layout with sidebar and navbar
 */
const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <AdminNavbar />

      {/* Main Layout Container */}
      <div className="flex">
        {/* Admin Sidebar */}
        <AdminSidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-6 ml-64">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

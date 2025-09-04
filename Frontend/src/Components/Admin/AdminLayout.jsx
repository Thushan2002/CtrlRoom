import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

/**
 * AdminLayout - Main layout component for admin pages
 * Provides consistent layout with sidebar and navbar
 */
const AdminLayout = ({ children }) => {
  return (
    <div className="py-5">
      {/* Main Layout Container */}
      <div className="flex">
        {/* Admin Sidebar */}
        <AdminSidebar />

        {/* Main Content Area */}
      </div>
    </div>
  );
};

export default AdminLayout;

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faDesktop,
  faUsers,
  faExclamationTriangle,
  faCog,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import AdminOverview from "../../Components/Admin/AdminOverview";
import AdminComputers from "../../Components/Admin/AdminComputers";
import AdminUsers from "../../Components/Admin/AdminUsers";
import AdminComplaints from "../../Components/Admin/AdminComplaints";
import AdminProfile from "../../Components/Admin/AdminProfile";
import AdminSettings from "../../Components/Admin/AdminSettings";

// Example component stubs

const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: faTachometerAlt,
      component: <AdminOverview />,
      description: "Overview and statistics",
    },
    {
      id: "computers",
      label: "Computers",
      icon: faDesktop,
      component: <AdminComputers />,
      description: "Manage computer inventory",
    },
    {
      id: "users",
      label: "Users",
      icon: faUsers,
      component: <AdminUsers />,
      description: "User management",
    },
    {
      id: "complaints",
      label: "Complaints",
      icon: faExclamationTriangle,
      component: <AdminComplaints />,
      description: "Handle complaints",
    },
    {
      id: "profile",
      label: "Profile",
      icon: faUser,
      component: <AdminProfile />,
      description: "Admin profile settings",
    },
    {
      id: "settings",
      label: "Settings",
      icon: faCog,
      component: <AdminSettings />,
      description: "System configuration",
    },
  ];

  const currentComponent =
    menuItems.find((item) => item.id === activeItem)?.component || null;

  return (
    <div className="flex h-full py-4">
      {/* Sidebar */}
      <aside className="w-64  bg-white shadow-lg border-r border-gray-200 z-40 rounded-xl">
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = activeItem === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveItem(item.id)}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-left transition-colors duration-200
                      ${
                        isActive
                          ? "bg-blue-400 text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }
                    `}
                    title={item.description}>
                    <FontAwesomeIcon
                      icon={item.icon}
                      className={`h-5 w-5 ${
                        isActive ? "text-white" : "text-gray-500"
                      }`}
                    />
                    <div className="flex-1">
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <p className="text-xs text-blue-100 mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        {currentComponent}
      </main>
    </div>
  );
};

export default AdminDashboard;

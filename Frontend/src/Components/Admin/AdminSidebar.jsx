import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faDesktop,
  faUsers,
  faExclamationTriangle,
  faChartBar,
  faCog,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

/**
 * AdminSidebar - Sidebar navigation for admin interface
 */
const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: faTachometerAlt,
      path: "/admin",
      description: "Overview and statistics",
    },
    {
      id: "computers",
      label: "Computers",
      icon: faDesktop,
      path: "/admin/computers",
      description: "Manage computer inventory",
    },
    {
      id: "users",
      label: "Users",
      icon: faUsers,
      path: "/admin/users",
      description: "User management",
    },
    {
      id: "complaints",
      label: "Complaints",
      icon: faExclamationTriangle,
      path: "/admin/complaints",
      description: "Handle complaints",
    },
    {
      id: "statistics",
      label: "Statistics",
      icon: faChartBar,
      path: "/admin/statistics",
      description: "Reports and analytics",
    },
    {
      id: "profile",
      label: "Profile",
      icon: faUser,
      path: "/admin/profile",
      description: "Admin profile settings",
    },
    {
      id: "settings",
      label: "Settings",
      icon: faCog,
      path: "/admin/settings",
      description: "System configuration",
    },
  ];

  return (
    <aside className="h-full  w-64 bg-white shadow-lg border-r border-gray-200 z-40 rounded-xl">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200
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
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;

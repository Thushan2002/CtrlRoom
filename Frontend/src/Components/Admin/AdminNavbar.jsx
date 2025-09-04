import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faSignOutAlt,
  faUser,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/images/logo.png";

/**
 * AdminNavbar - Top navigation bar for admin interface
 */
const AdminNavbar = () => {
  const { user, logout } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Title */}
          <div className="flex items-center space-x-4">
            <img src={logo} alt="CtrlRoom Logo" className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">CtrlRoom</h1>
              <p className="text-sm text-gray-500">Admin Panel</p>
            </div>
          </div>

          {/* Right side - User menu and notifications */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="h-4 w-4 text-white"
                  />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || "Admin User"}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <a
                    href="/admin/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile Settings
                  </a>
                  <a
                    href="/admin/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    System Settings
                  </a>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;

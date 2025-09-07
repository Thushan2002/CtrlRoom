// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faHome,
  faTachometerAlt,
  faBug,
  faSignOutAlt,
  faSignInAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/images/logo.png";
import { useApp } from "../context/AppContext.jsx";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, role, token, logout } = useApp();
  const location = useLocation();
  const isAuthenticated = Boolean(token || user);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-background-2 inset-shadow-sm/80 rounded-2xl">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo */}
        <img
          src={logo}
          alt="CtrlRoom Logo"
          className="w-10 md:w-14 h-12 md:h-16 md:ml-5"
        />

        {/* Toggle Button (Mobile) */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md hover:bg-hover-1 focus:outline-none"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu">
            <FontAwesomeIcon
              icon={isOpen ? faTimes : faBars}
              size="lg"
              className="text-text-2"
            />
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 items-center text-text-2 cursor-pointer">
          <CustomNavLink to="/" icon={faHome}>
            Home
          </CustomNavLink>
          {role === "student" && (
            <CustomNavLink to="/dashboard" icon={faTachometerAlt}>
              Dashboard
            </CustomNavLink>
          )}

          {role === "admin" && (
            <CustomNavLink to="/admin" icon={faTachometerAlt}>
              Admin Dashboard
            </CustomNavLink>
          )}
          {role !== "admin" && isAuthenticated && (
            <CustomNavLink to="/profile" icon={faUser}>
              Profile
            </CustomNavLink>
          )}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center py-2 px-3 rounded-md cursor-pointer hover:bg-hover-1 text-text-2 hover:text-primary-4 transition-colors group">
              <FontAwesomeIcon
                icon={faSignOutAlt}
                className="mr-2 group-hover:text-primary-3"
              />
              <span className="group-hover:text-primary-3">Logout</span>
            </button>
          ) : (
            <NavLink
              to="/login"
              className="flex items-center py-2 px-3 rounded-md hover:bg-hover-1 text-text-2 hover:text-primary-4 transition-colors group">
              <FontAwesomeIcon
                icon={faSignInAlt}
                className="mr-2 group-hover:text-primary-3"
              />
              <span className="group-hover:text-primary-3">Login</span>
            </NavLink>
          )}
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            id="mobile-menu"
            className="md:hidden absolute w-[80%] text-text-2 top-20 right-8 bg-background-dark z-50 py-4 px-6 shadow-xl rounded-lg mt-2">
            <div className="flex flex-col gap-4">
              <CustomMobileNavLink to="/" icon={faHome} onClick={toggleMenu}>
                Home
              </CustomMobileNavLink>
              {role === "student" && (
                <CustomMobileNavLink
                  to="/dashboard"
                  icon={faTachometerAlt}
                  onClick={toggleMenu}>
                  Dashboard
                </CustomMobileNavLink>
              )}

              {role === "admin" && (
                <CustomMobileNavLink
                  to="/admin"
                  icon={faTachometerAlt}
                  onClick={toggleMenu}>
                  Admin Dashboard
                </CustomMobileNavLink>
              )}
              {role !== "admin" && isAuthenticated && (
                <CustomMobileNavLink
                  to="/profile"
                  icon={faUser}
                  onClick={toggleMenu}>
                  Profile
                </CustomMobileNavLink>
              )}
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center py-2 px-3 rounded-md cursor-pointer hover:bg-hover-1 text-text-2 hover:text-primary-4 transition-colors group w-full text-left">
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    className="mr-2 group-hover:text-primary-3"
                  />
                  <span className="group-hover:text-primary-3">Logout</span>
                </button>
              ) : (
                <NavLink
                  to="/login"
                  className="flex items-center py-2 px-3 rounded-md hover:bg-hover-1 text-text-2 hover:text-primary-4 transition-colors group"
                  onClick={toggleMenu}>
                  <FontAwesomeIcon
                    icon={faSignInAlt}
                    className="mr-2 group-hover:text-primary-3"
                  />
                  <span className="group-hover:text-primary-3">Login</span>
                </NavLink>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Reusable NavLink with active styles (Desktop)
const CustomNavLink = ({ to, icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center py-2 px-3 rounded-md transition-colors group ${
        isActive
          ? "bg-hover-1 text-primary-4"
          : "text-text-2 hover:bg-hover-1 hover:text-primary-4"
      }`
    }>
    <FontAwesomeIcon icon={icon} className="mr-2 group-hover:text-primary-3" />
    <span className="group-hover:text-primary-3">{children}</span>
  </NavLink>
);

// Reusable NavLink for mobile with click handler
const CustomMobileNavLink = ({ to, icon, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center py-2 px-3 rounded-md transition-colors group ${
        isActive
          ? "bg-hover-1 text-primary-4"
          : "text-text-2 hover:bg-hover-1 hover:text-primary-4"
      }`
    }>
    <FontAwesomeIcon icon={icon} className="mr-2 group-hover:text-primary-3" />
    <span className="group-hover:text-primary-3">{children}</span>
  </NavLink>
);

export default Navbar;

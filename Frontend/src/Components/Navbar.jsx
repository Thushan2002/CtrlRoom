// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faHome,
  faTachometerAlt,
  faBug,
  faSignOutAlt,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/images/logo.png";
import API from "../services/api";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setIsAuthenticated(false);
      setRole(null);
      return;
    }
    API.get("/user")
      .then((res) => {
        setIsAuthenticated(true);
        setRole(res.data.role || (res.data.user && res.data.user.role) || null);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setRole(null);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await API.post("/logout");
    } catch (_) {
      // ignore errors
    } finally {
      localStorage.removeItem("auth_token");
      setIsAuthenticated(false);
      setRole(null);
    }
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
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md hover:bg-hover-1 focus:outline-none"
            aria-label="Toggle menu">
            <FontAwesomeIcon
              icon={isOpen ? faTimes : faBars}
              size="lg"
              className="text-text-2"
            />
          </button>
        </div>

        {/* Links */}
        <div
          className={`${
            isOpen
              ? "block absolute w-[80%] text-text-2 top-26 right-8 bg-background-dark z-50 py-4 px-6 shadow-xl"
              : "hidden"
          } text-text-2 md:flex md:static md:bg-transparent md:shadow-none gap-6 items-center`}>
          <CustomNavLink to="/" icon={faHome}>
            Home
          </CustomNavLink>
          {role === "admin" && (
            <CustomNavLink to="/dashboard" icon={faTachometerAlt}>
              Dashboard
            </CustomNavLink>
          )}
          {role !== "admin" && (
            <CustomNavLink to="/complaints" icon={faBug}>
              Complaints
            </CustomNavLink>
          )}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center py-2 px-3 rounded-md hover:bg-hover-1 text-text-2 hover:text-primary-4 transition-colors group">
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
      </div>
    </nav>
  );
};

// Reusable NavLink with active styles
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

export default Navbar;

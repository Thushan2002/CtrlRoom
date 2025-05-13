// src/components/Navbar.jsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faHome,
  faTachometerAlt,
  faBug,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/images/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-background-2 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo */}

        <img src={logo} alt="" className="w-10 md:w-14 h-12 md:h-16  md:ml-5" />

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
              ? "block absolute text-text-2 top-16 left-0 right-0 bg-background-dark z-50 py-4 px-6 shadow-xl"
              : "hidden"
          } text-text-2 md:flex md:static md:bg-transparent md:shadow-none gap-6 items-center`}>
          <NavLink href="/" icon={faHome}>
            Home
          </NavLink>
          <NavLink
            href="/dashboard"
            className="bg-background-dark"
            icon={faTachometerAlt}>
            Dashboard
          </NavLink>
          <NavLink href="/complaints" icon={faBug}>
            Complaints
          </NavLink>
          <button className="flex items-center py-2 px-3 rounded-md hover:bg-hover-1 text-text-2 hover:text-primary-4 transition-colors group">
            <FontAwesomeIcon
              icon={faSignOutAlt}
              className="mr-2 group-hover:text-primary-3"
            />
            <span className="group-hover:text-primary-3">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

// Reusable NavLink component for consistent styling
const NavLink = ({ href, icon, children }) => (
  <a
    href={href}
    className="flex items-center py-2 px-3 rounded-md hover:bg-hover-1 text-text-2 hover:text-primary-4 transition-colors group">
    <FontAwesomeIcon icon={icon} className="mr-2 group-hover:text-primary-3" />
    <span className="group-hover:text-primary-3">{children}</span>
  </a>
);

export default Navbar;

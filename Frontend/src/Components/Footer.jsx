// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faTachometerAlt,
  faBug,
  faSignInAlt,
  faSignOutAlt,
  faArrowUp,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useApp } from "../context/AppContext.jsx";

const Footer = () => {
  const { user, role, token, logout } = useApp();
  const isAuthenticated = Boolean(token || user);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white mt-16">
      <div className="w-[95%] sm:w-[90%] lg:w-[85%] mx-auto py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-sm">
        {/* Brand */}
        <div className="flex sm:items-start gap-6">
          <div className="flex-shrink-0 bg-white rounded-full w-20 h-20 p-3 flex items-center justify-center shadow-lg">
            <img
              src={logo}
              alt="CtrlRoom logo"
              className="w-full h-auto object-contain"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2 tracking-wider">CtrlRoom</h2>
            <p className="text-blue-100 tracking-wider font-thin">
              Your smart solution to manage and monitor university computer labs
              effectively.
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="font-thin">
          <h2 className="text-lg font-medium mb-4 pb-2 border-b border-blue-700">
            Quick Links
          </h2>
          <nav className="space-y-3">
            <Link
              to="/"
              className="hover:text-blue-300 transition-colors duration-200 flex items-center">
              <FontAwesomeIcon
                icon={faHome}
                className="mt-1 mr-3 text-blue-300"
              />
              Home
            </Link>
            <Link
              to="/dashboard"
              className="hover:text-blue-300 transition-colors duration-200 flex items-center">
              <FontAwesomeIcon
                icon={faTachometerAlt}
                className="mt-1 mr-3 text-blue-300"
              />
              Dashboard
            </Link>
            {role === "admin" && (
              <Link
                to="/complaints"
                className="hover:text-blue-300 transition-colors duration-200 flex items-center">
                <FontAwesomeIcon
                  icon={faBug}
                  className="mt-1 mr-3 text-blue-300"
                />
                Complaints
              </Link>
            )}
            {role !== "admin" && isAuthenticated && (
              <Link
                to="/profile"
                className="hover:text-blue-300 transition-colors duration-200 flex items-center">
                <FontAwesomeIcon
                  icon={faUser}
                  className="mt-1 mr-3 text-blue-300"
                />
                Profile
              </Link>
            )}
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="hover:text-blue-300 transition-colors duration-200 flex items-center">
                <FontAwesomeIcon
                  icon={faSignInAlt}
                  className="mt-1 mr-3 text-blue-300"
                />
                Login
              </Link>
            ) : (
              <button
                onClick={logout}
                className="hover:text-blue-300 transition-colors duration-200 flex items-center">
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  className="mt-1 mr-3 text-blue-300"
                />
                Logout
              </button>
            )}
          </nav>
        </div>

        {/* Contact Info */}
        <div className="font-thin">
          <h2 className="text-lg mb-4 pb-2 border-b border-blue-700 font-medium">
            Contact
          </h2>
          <address className="space-y-3 not-italic">
            <div className="flex items-start">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="mt-1 mr-3 text-blue-300"
              />
              <span>Sabaragamuwa University of Sri Lanka</span>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="mr-3 text-blue-300"
              />
              <a
                href="mailto:support@ctrlroom.lk"
                className="hover:text-blue-300 transition-colors duration-200">
                support@ctrlroom.lk
              </a>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faPhone} className="mr-3 text-blue-300" />
              <a
                href="tel:+94451234567"
                className="hover:text-blue-300 transition-colors duration-200">
                +94 45 123 4567
              </a>
            </div>
          </address>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-12 h-12 bg-blue-700 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Back to top">
        <FontAwesomeIcon icon={faArrowUp} className="text-white text-xl" />
      </button>

      {/* Bottom Bar */}
      <div className="bg-blue-950 text-center py-4 text-sm">
        <div className="w-[95%] sm:w-[90%] lg:w-[85%] mx-auto">
          <p>
            &copy; {new Date().getFullYear()} CtrlRoom. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

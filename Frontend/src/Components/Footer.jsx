// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6 text-sm">
        {/* Brand */}
        <div>
          <h1 className="text-xl font-bold mb-2">CtrlRoom</h1>
          <p>
            Your smart solution to manage and monitor university computer labs
            effectively.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:text-gray-300">
                Home
              </a>
            </li>
            <li>
              <a href="/dashboard" className="hover:text-gray-300">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/complaints" className="hover:text-gray-300">
                Complaints
              </a>
            </li>
            <li>
              <a href="/login" className="hover:text-gray-300">
                Login
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Contact</h2>
          <p>Sabaragamuwa University of Sri Lanka</p>
          <p>Email: support@ctrlroom.lk</p>
          <p>Phone: +94 45 123 4567</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-blue-950 text-center text-xs py-4">
        &copy; {new Date().getFullYear()} CtrlRoom. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

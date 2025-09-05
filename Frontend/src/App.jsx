import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import HomePage from "./Pages/HomePage";
import Dashboard from "./Pages/Dashboard";
import Footer from "./Components/Footer";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import Computer from "./Pages/Computer";

// Admin imports

import AdminDashboard from "./Pages/Admin/AdminDashboard";
import { AdminRoute } from "./utils/roleGuards.jsx";
import AdminComputers from "./Components/Admin/AdminComputers.jsx";
import AdminOverview from "./Components/Admin/AdminOverview.jsx";

const App = () => {
  return (
    <div className="bg-background-2">
      {/* Routes outside main container */}
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>

      <div className="w-[95%] sm:w-[90%] md:w-[90%] mx-auto pt-6 md:pt-10">
        <Navbar />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/computer/:pcId" element={<Computer />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin routes with layout + guard */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }></Route>
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default App;

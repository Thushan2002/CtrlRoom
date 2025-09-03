import React from "react";
import Navbar from "./Components/Navbar";
import HomePage from "./Pages/HomePage";
import Dashboard from "./Pages/Dashboard";
import Footer from "./Components/Footer";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import { Route, Routes, useLocation } from "react-router-dom";
import Profile from "./Pages/Profile";

// Admin imports
import AdminLayout from "./Components/Admin/AdminLayout";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import { AdminRoute } from "./utils/roleGuards.jsx";

const App = () => {
  const location = useLocation();

  const hideNavbarPaths = ["/login"];
  const hideNavbarForAdmin = location.pathname.startsWith("/admin");
  const shouldShowNavbar =
    !hideNavbarPaths.includes(location.pathname) && !hideNavbarForAdmin;

  return (
    <div className="bg-background-2">
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
      <div className="w-[95%] sm:w-[90%] md:w-[90%] mx-auto pt-6 md:pt-10">
        {shouldShowNavbar && <Navbar />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;

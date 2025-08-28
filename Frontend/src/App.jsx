import React from "react";
import Navbar from "./Components/Navbar";
import HomePage from "./Pages/HomePage";
import Footer from "./Components/Footer";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import { Route, Routes, useLocation } from "react-router-dom";

const App = () => {
  const location = useLocation();

  const hideNavbarPaths = ["/login"];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

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
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
import React from "react";
import Navbar from "./Components/Navbar";
import HomePage from "./Pages/HomePage";
import Footer from "./Components/Footer";

const App = () => {
  return (
    <div className=" bg-background-2">
      <div className="w-[95%] sm:w-[90%] md:w-[90%] mx-auto pt-6 md:pt-10">
        <Navbar />
        <HomePage />
      </div>
      <Footer />
    </div>
  );
};

export default App;

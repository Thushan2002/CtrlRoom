import React from "react";
import Navbar from "./Components/Navbar";
import HomePage from "./Pages/HomePage";
import Footer from "./Components/Footer";
import SignUp from "./Pages/Signup";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <div className=" bg-background-2">
      <div className="w-[95%] sm:w-[90%] md:w-[90%] mx-auto pt-6 md:pt-10">
        <Navbar />
       <Routes>
        <Route path = '/' element = {<HomePage/>} />
        <Route path = '/signup' element = {<SignUp/>} />
       </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;

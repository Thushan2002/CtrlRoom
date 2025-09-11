import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldAlt,
  faChartLine,
  faChevronRight,
  faMobileAlt,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";

// Placeholder images (replace with your actual image imports)
import heroImage from "../assets/images/hero-image.png";
import teamImage from "../assets/images/team-work.png";
import { useApp } from "../context/AppContext";

const HomePage = () => {
  const { user, role, navigate } = useApp();

  const navigateUser = () => {
    if (user) {
      if (role === "student") {
        navigate("/dashboard");
      } else {
        navigate("/admin-dashboard");
      }
    } else {
      navigate("/login");
    }
  };
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 md:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center z-10">
          {/* Left side */}
          <div className="text-center md:text-left animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-text-2 text-shadow-lg">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-background-dark to-primary-3">
                Ctrl
              </span>
              Room
            </h1>
            <p className="text-xl md:text-3xl font-semibold text-text-2 max-w-2xl mb-8 leading-relaxed text-shadow-text-1">
              Revolutionizing Computer Lab Management with real-time monitoring.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={() => navigateUser()}
                className="px-8 py-3 bg-gradient-to-r from-background-dark to-primary-3 text-white rounded-lg hover:bg-primary-3 transition-all transform hover:scale-105 shadow-lg cursor-pointer">
                Get Started{" "}
                <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
              </button>
            </div>

            <div className="mt-12 flex flex-wrap justify-center md:justify-start gap-6">
              <div className="flex items-center">
                <FontAwesomeIcon
                  icon={faShieldAlt}
                  className="text-primary-4 mr-2"
                />
                <span className="text-text-1">Enterprise Security</span>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon
                  icon={faChartLine}
                  className="text-primary-4 mr-2"
                />
                <span className="text-text-1">Real-time Analytics</span>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className=" animate-float floating-element drop-shadow-lg">
            <img
              src={heroImage}
              alt="Dashboard interface"
              className="w-full max-w-xl rounded-xl drop-shadow-lg"
            />
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
          <a href="#about" className="text-text-1">
            <FontAwesomeIcon icon={faAngleDown}></FontAwesomeIcon>
          </a>
        </div>
      </section>

      {/* About Us Section */}
      <section
        id="about"
        className="py-10 md:py-20 rounded-2xl shadow-2xl px-5 md:px-20 bg-background-dark text-text-3">
        <div className="mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-primary-4">About</span> Our Platform
            </h2>
            <p className="text-lg mb-6 leading-relaxed">
              CtrlRoom is an all-in-one platform designed to simplify complaint
              management, dashboard monitoring, and real-time alerts. We help
              organizations streamline their internal control processes through
              intuitive and modern tools.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <FontAwesomeIcon
                  icon={faShieldAlt}
                  className="text-primary-4 mt-1 mr-3"
                />
                <span>Military-grade security for your sensitive data</span>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon
                  icon={faChartLine}
                  className="text-primary-4 mt-1 mr-3"
                />
                <span>Real-time analytics and reporting</span>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon
                  icon={faMobileAlt}
                  className="text-primary-4 mt-1 mr-3"
                />
                <span>Fully responsive on all devices</span>
              </li>
            </ul>
            <button className="px-6 py-3 bg-primary-1 text-text-3 rounded-lg hover:bg-primary-3 transition-all">
              Learn More
            </button>
          </div>
          <div className="relative">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <img
                src={teamImage}
                alt="Team working together"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent opacity-80"></div>
            </div>
            <div className="absolute -bottom-8 -right-2 bg-primary-3 p-3 md:p-6 rounded-xl shadow-lg w-full md:w-3/4">
              <h4 className="font-bold text-sm md:text-lg mb-2">
                24/7 Support
              </h4>
              <p className="text-xs md:text-sm">
                Our team is always ready to assist you with any questions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

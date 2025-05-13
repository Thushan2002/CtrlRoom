import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldAlt,
  faChartLine,
  faChevronRight,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";

import heroImage from "../assets/images/hero-image.png";

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 md:px-8 bg-background-2  overflow-hidden">
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
              <button className="px-8 py-3 bg-gradient-to-r from-background-dark to-primary-3 text-white rounded-lg hover:bg-primary-3 transition-all transform hover:scale-105 shadow-lg">
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
          <div className="hidden md:block animate-float floating-element drop-shadow-lg">
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
    </div>
  );
};

export default HomePage;

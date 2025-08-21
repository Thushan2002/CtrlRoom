import React from "react";

const SignUp = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white overflow-hidden">
      {/* Floating circles */}
      <div className="absolute w-48 h-48 bg-blue-900 rounded-full bottom-[-60px] left-[-60px] opacity-70 blur-md"></div>
      <div className="absolute w-24 h-24 bg-blue-900 rounded-full top-16 left-40 opacity-70 blur-md"></div>
      <div className="absolute w-20 h-20 bg-blue-900 rounded-full top-10 right-40 opacity-70 blur-md"></div>
      <div className="absolute w-36 h-36 bg-blue-900 rounded-full bottom-24 right-12 opacity-70 blur-md"></div>

      <div className="relative text-center z-10">
        {/* Title */}
        <h2 className="text-2xl font-semibold mb-1">
          Welcome to <span className="font-bold text-blue-700">CtrlRoom</span>
        </h2>
        <p className="font-medium text-black mb-6">
          Computer Lab Management System
        </p>

        {/* Sign Up Box */}
        <div className="bg-blue-50 px-8 py-6 rounded-xl shadow-md w-80">
          <h3 className="text-lg font-semibold mb-4">Sign Up</h3>
          <form className="space-y-3">
            <input
              type="text"
              placeholder="Full name"
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-800 hover:bg-blue-900 text-white py-2 rounded-md font-semibold"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-3 text-sm">
            Already have an account?{" "}
            <a href="#" className="text-blue-700 font-semibold hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

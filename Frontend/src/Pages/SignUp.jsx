import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

const SignUp = () => {
  const navigate = useNavigate();
  const { signupStudent, login, user, loading } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!loading && user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-grid-blue-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">CR</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join <span className="text-blue-600">CtrlRoom</span>
          </h1>
          <p className="text-gray-600">Computer Lab Management System</p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-white/20">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Create Account
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Get started with your free account
            </p>
          </div>

          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              setSubmitting(true);
              try {
                await signupStudent({
                  name,
                  email,
                  password,
                  password_confirmation: passwordConfirmation,
                });
                await login({ email, password });
                navigate("/");
              } catch (err) {
                const msg =
                  err?.response?.data?.message ||
                  (typeof err?.response?.data === "string"
                    ? err.response.data
                    : "Sign up failed");
                const errors = err?.response?.data;
                if (errors && typeof errors === "object") {
                  const firstKey = Object.keys(errors)[0];
                  const firstMsg = Array.isArray(errors[firstKey])
                    ? errors[firstKey][0]
                    : String(errors[firstKey]);
                  setError(firstMsg || msg);
                } else {
                  setError(msg);
                }
              } finally {
                setSubmitting(false);
              }
            }}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-700"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-700"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-700"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full px-4 py-3 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-700"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
              {submitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200">
                Sign In
              </Link>
            </p>
          </form>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200 rounded-full opacity-20 blur-xl" />
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-indigo-200 rounded-full opacity-20 blur-xl" />
      </div>
    </div>
  );
};

export default SignUp;

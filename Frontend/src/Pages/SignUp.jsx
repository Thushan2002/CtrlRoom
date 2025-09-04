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
          <form
            className="space-y-3"
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
                // auto-login right after successful sign up
                await login({ email, password });
                navigate("/");
              } catch (err) {
                const msg =
                  err?.response?.data?.message ||
                  (typeof err?.response?.data === "string"
                    ? err.response.data
                    : "Sign up failed");
                // Laravel validation may return an object of errors
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
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-800 hover:bg-blue-900 text-white py-2 rounded-md font-semibold disabled:opacity-60">
              {submitting ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
          <p className="mt-3 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-700 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

import Logo from "../assets/images/logo.png";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const navigate = useNavigate();
  const { login, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!loading && user) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="flex min-h-screen w-full flex-col bg-center relative">
        <div className="flex bg-blue-900 justify-between p-4 sm:p-6 z-10">
          <div className="flex items-center mx-4 sm:mx-8">
            <img
              src={Logo}
              alt="Ctrl Room Logo"
              className="h-10 w-12 sm:h-12 sm:w-14"
            />
            <h1 className="text-lg sm:text-xl text-white font-semibold mx-2 py-2">
              Ctrl Room
            </h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              to="/signup"
              className="bg-white rounded-2xl text-indigo-900 text-sm px-4 py-2 sm:w-25 sm:h-10 hover:shadow-xl cursor-pointer border-2 border-indigo-950 font-bold flex items-center">
              Sign Up
            </Link>
          </nav>
        </div>
        <div className="flex flex-col items-center justify-center flex-grow w-full px-4">
          <div className="w-full max-w-md sm:max-w-lg flex flex-col justify-center text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-800">
              Welcome to
            </h1>
            <h2 className="text-3xl sm:text-5xl font-bold px-4 sm:px-15">
              <span className="text-blue-950">Ctrl</span>
              <span className="text-blue-600">Room</span>
            </h2>
            <p className="font-bold text-lg sm:text-xl mt-2">
              Computer Lab Management System
            </p>
          </div>
          <div
            className="bg-blue-100 rounded-xl text-center w-[400px] h-[300px] flex flex-col 
          items-center relative z-10 mt-10">
            <h1 className="text-3xl font-bold text-blue-800 mt-5">Sign In</h1>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 border-gray-300 pl-3 rounded-xl mt-5 w-80 h-12"
            />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-2 border-gray-300 pl-3 rounded-xl mt-3 w-80 h-12"
            />
            <a
              href="#"
              className="text-xs font-bold text-blue-950 mt-2 block
            ">
              Forgot Password?
            </a>
            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
            <button
              onClick={async () => {
                setError("");
                setSubmitting(true);
                try {
                  await login({ email, password });
                  navigate("/");
                } catch (err) {
                  const msg = err?.response?.data?.message || "Login failed";
                  setError(msg);
                } finally {
                  setSubmitting(false);
                }
              }}
              disabled={submitting}
              className="bg-blue-900 rounded-xl w-80 h-10 text-white font-bold mt-3 cursor-pointer disabled:opacity-60">
              {submitting ? "Signing In..." : "Sign In"}
            </button>
            <p className="text-xs mt-2 font-bold">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-900 pl-3">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
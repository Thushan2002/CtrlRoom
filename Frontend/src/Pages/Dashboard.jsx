import React, { useState } from "react";
import PcComponent from "../Components/pcComponent";
import { useApp } from "../context/AppContext";
import Profile from "./Profile";
import Computers from "./Computers";

const computers = Array.from({ length: 36 }, (_, i) => {
  const num = (i + 1).toString().padStart(3, "0");
  const id = `PC-${num}`;
  const status = i % 9 === 0 ? "Unavailable" : "Available";
  return { id, status };
});

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const { user, role, logout } = useApp();

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "profile", label: "Profile" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <Profile />;
      default:
        return <Computers />;
    }
  };

  return (
    <div className="pb-10 flex my-10 gap-6">
      {/* Inline Sidebar */}
      <aside className="w-56 shrink-0 h-full bg-white rounded-xl shadow-sm p-3">
        <div className="px-2 py-3">
          <div className="text-lg font-semibold text-slate-800">CtrlRoom</div>
        </div>
        <nav className="mt-2 flex flex-col gap-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                activeSection === item.id
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-4">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;

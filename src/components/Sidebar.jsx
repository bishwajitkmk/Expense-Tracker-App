/* eslint-disable no-unused-vars */
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleNavigation = (path) => {
    // If currently on dashboard and navigating to another page, force refresh
    if (location.pathname === "/" && path !== "/") {
      // Navigate first, then force refresh after a small delay
      navigate(path);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } else {
      // Normal navigation for other cases
      navigate(path);
    }
  };

  return (
    <aside className="w-64 h-screen bg-blue-800 text-white flex flex-col items-center py-8 shadow-lg fixed left-0 top-0 z-50">
      <div className="mb-10">
        <span className="text-2xl font-bold tracking-tight">ExpansePro</span>
      </div>
      <nav className="flex flex-col gap-6 w-full px-6">
        <button
          onClick={() => handleNavigation("/")}
          className={`font-medium transition-colors duration-200 text-left ${
            isActive("/")
              ? "text-white bg-blue-700 px-3 py-2 rounded-lg"
              : "text-blue-100 hover:text-white"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => handleNavigation("/transactions")}
          className={`font-medium transition-colors duration-200 text-left ${
            isActive("/transactions")
              ? "text-white bg-blue-700 px-3 py-2 rounded-lg"
              : "text-blue-100 hover:text-white"
          }`}
        >
          Transactions
        </button>
        <button
          onClick={() => handleNavigation("/categories")}
          className={`font-medium transition-colors duration-200 text-left ${
            isActive("/categories")
              ? "text-white bg-blue-700 px-3 py-2 rounded-lg"
              : "text-blue-100 hover:text-white"
          }`}
        >
          Categories
        </button>
        <button
          onClick={() => handleNavigation("/family-planning")}
          className={`font-medium transition-colors duration-200 text-left ${
            isActive("/family-planning")
              ? "text-white bg-blue-700 px-3 py-2 rounded-lg"
              : "text-blue-100 hover:text-white"
          }`}
        >
          Family Planning
        </button>
        <button
          onClick={() => handleNavigation("/subscriptions")}
          className={`font-medium transition-colors duration-200 text-left ${
            isActive("/subscriptions")
              ? "text-white bg-blue-700 px-3 py-2 rounded-lg"
              : "text-blue-100 hover:text-white"
          }`}
        >
          Subscriptions
        </button>
        <button
          onClick={() => handleNavigation("/settings")}
          className={`font-medium transition-colors duration-200 text-left ${
            isActive("/settings")
              ? "text-white bg-blue-700 px-3 py-2 rounded-lg"
              : "text-blue-100 hover:text-white"
          }`}
        >
          Settings
        </button>
      </nav>
      <div className="mt-auto px-6 w-full">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mt-10 transition-colors duration-200">
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

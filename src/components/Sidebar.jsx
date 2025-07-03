/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => (
  <aside className="w-64 h-screen bg-blue-800 text-white flex flex-col items-center py-8 shadow-lg fixed left-0 top-0 z-[9999] pointer-events-auto">
    <div className="mb-10">
      <span className="text-2xl font-bold tracking-tight">ExpansePro</span>
    </div>
    <nav className="flex flex-col gap-6 w-full px-6">
      <Link to="/" className="text-blue-100 hover:text-white font-medium">
        Dashboard
      </Link>
      <Link
        to="/transactions"
        className="text-blue-100 hover:text-white font-medium"
      >
        Transactions
      </Link>
      <Link
        to="/categories"
        className="text-blue-100 hover:text-white font-medium"
      >
        Categories
      </Link>
      <Link
        to="/settings"
        className="text-blue-100 hover:text-white font-medium"
      >
        Settings
      </Link>
    </nav>
    <div className="mt-auto px-6 w-full">
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mt-10">
        Logout
      </button>
    </div>
  </aside>
);

export default Sidebar;

/* eslint-disable no-unused-vars */
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

  const navigationItems = [
    { path: "/", label: "Dashboard" },
    { path: "/transactions", label: "Transactions" },
    { path: "/categories", label: "Categories" },
    { path: "/currency-converter", label: "Currency Converter" },
    { path: "/family-planning", label: "Family Planning" },
    { path: "/subscriptions", label: "Subscriptions" },
    { path: "/settings", label: "Settings" },
  ];

  return (
    <aside className="w-64 h-screen bg-blue-800 text-white flex flex-col items-center py-8 shadow-lg fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="mb-10">
        <span className="text-2xl font-bold tracking-tight">ExpansePro</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 w-full">
        <ul className="space-y-2 px-4">
          {navigationItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => handleNavigation(item.path)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-150 ${
                  isActive(item.path)
                    ? "bg-blue-700 text-white shadow-md"
                    : "text-blue-100 hover:bg-blue-700 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="mt-auto px-4 text-center">
        <p className="text-blue-200 text-sm">© 2024 ExpansePro</p>
        <p className="text-blue-300 text-xs mt-1">Smart Finance Management</p>
      </div>
    </aside>
  );
};

export default Sidebar;

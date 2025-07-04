import { Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transactions";
import Categories from "./components/Categories";
import Settings from "./components/Settings";
import FamilyPlanning from "./components/FamilyPlanning";
import Subscriptions from "./components/Subscriptions";
import { SettingsProvider } from "./contexts/SettingsContext";
import { NotificationProvider } from "./contexts/NotificationContext";

const Layout = () => (
  <div className="min-h-screen flex bg-gray-50">
    <Sidebar />
    <main className="flex-1 ml-64 relative z-10">
      <Outlet />
    </main>
  </div>
);

const App = () => (
  <NotificationProvider>
    <SettingsProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="categories" element={<Categories />} />
          <Route path="family-planning" element={<FamilyPlanning />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="settings" element={<Settings />} />
          <Route
            path="*"
            element={<div className="p-8">404 - Page Not Found</div>}
          />
        </Route>
      </Routes>
    </SettingsProvider>
  </NotificationProvider>
);

export default App;

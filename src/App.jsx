import { Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";

const Transactions = () => <div className="p-8">Transactions</div>;
const Categories = () => <div className="p-8">Categories</div>;
const Settings = () => <div className="p-8">Settings</div>;

const Layout = () => (
  <div className="min-h-screen flex">
    <Sidebar />
    <div className="flex-1 ml-64 relative z-0">
      <Outlet />
    </div>
  </div>
);

const App = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Dashboard />} />
      <Route path="transactions" element={<Transactions />} />
      <Route path="categories" element={<Categories />} />
      <Route path="settings" element={<Settings />} />
      <Route
        path="*"
        element={<div className="p-8">404 - Page Not Found</div>}
      />
    </Route>
  </Routes>
);

export default App;

import { Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./components/pages/Dashboard";
import Transactions from "./components/pages/Transactions";
import Categories from "./components/pages/Categories";
import CurrencyConverter from "./components/pages/CurrencyConverter";
import Settings from "./components/pages/Settings";
import FamilyPlanning from "./components/pages/FamilyPlanning";
import Subscriptions from "./components/pages/Subscriptions";
import { SettingsProvider } from "./contexts/SettingsContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { TransactionProvider } from "./contexts/TransactionContext";
import { ExchangeRateProvider } from "./contexts/ExchangeRateContext";
import { CategoriesProvider } from "./contexts/CategoriesContext";
import { SubscriptionsProvider } from "./contexts/SubscriptionsContext";
import { FamilyProvider } from "./contexts/FamilyContext";

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
      <ExchangeRateProvider>
        <TransactionProvider>
          <CategoriesProvider>
            <SubscriptionsProvider>
              <FamilyProvider>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="transactions" element={<Transactions />} />
                    <Route path="categories" element={<Categories />} />
                    <Route
                      path="currency-converter"
                      element={<CurrencyConverter />}
                    />
                    <Route
                      path="family-planning"
                      element={<FamilyPlanning />}
                    />
                    <Route path="subscriptions" element={<Subscriptions />} />
                    <Route path="settings" element={<Settings />} />
                    <Route
                      path="*"
                      element={
                        <div className="p-8">
                          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                              404 - Page Not Found
                            </h1>
                            <p className="text-gray-600">
                              The page you&apos;re looking for doesn&apos;t
                              exist.
                            </p>
                          </div>
                        </div>
                      }
                    />
                  </Route>
                </Routes>
              </FamilyProvider>
            </SubscriptionsProvider>
          </CategoriesProvider>
        </TransactionProvider>
      </ExchangeRateProvider>
    </SettingsProvider>
  </NotificationProvider>
);

export default App;

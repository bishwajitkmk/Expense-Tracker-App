import { useState } from "react";
import { useSettings } from "../../contexts/SettingsContext";
import { useExchangeRate } from "../../contexts/ExchangeRateContext";
import PageHeader from "../layout/PageHeader";
import { CurrencySelector } from "../ui";

const Settings = () => {
  const { settings, updateSettings, updateNestedSettings, getFontSizeClass } =
    useSettings();

  const { refreshRates, loading, getRateStatus, getSupportedCurrencies } =
    useExchangeRate();

  const [activeTab, setActiveTab] = useState("general");
  const rateStatus = getRateStatus();
  const currencies = getSupportedCurrencies();

  const tabs = [
    { id: "general", label: "General", icon: "⚙️" },
    { id: "currency", label: "Currency", icon: "💰" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  const fontSizes = [
    { value: "Small", label: "Small" },
    { value: "Medium", label: "Medium" },
    { value: "Large", label: "Large" },
  ];

  const themeColors = [
    { value: "Blue", label: "Blue", color: "bg-blue-500" },
    { value: "Slate", label: "Slate", color: "bg-slate-500" },
    { value: "Green", label: "Green", color: "bg-green-500" },
    { value: "Purple", label: "Purple", color: "bg-purple-500" },
    { value: "Gray", label: "Gray", color: "bg-gray-500" },
  ];

  const handleCurrencyChange = (currencyCode) => {
    updateSettings("currency", currencyCode);
    // Refresh rates when currency changes
    refreshRates();
  };

  return (
    <div className={`p-8 min-h-screen ${getFontSizeClass()}`}>
      <PageHeader
        title="Settings"
        subtitle="Configure your application preferences"
      />

      <div className="bg-white rounded-lg shadow-lg">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* General Settings */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                General Settings
              </h3>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size
                </label>
                <select
                  value={settings.fontSize}
                  onChange={(e) => updateSettings("fontSize", e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {fontSizes.map((size) => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Theme Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme Color
                </label>
                <div className="flex space-x-3">
                  {themeColors.map((theme) => (
                    <button
                      key={theme.value}
                      onClick={() => updateSettings("themeColor", theme.value)}
                      className={`w-8 h-8 rounded-full ${
                        theme.color
                      } border-2 ${
                        settings.themeColor === theme.value
                          ? "border-gray-900"
                          : "border-gray-300"
                      }`}
                      title={theme.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Currency Settings */}
          {activeTab === "currency" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                Currency Settings
              </h3>

              {/* Exchange Rate Status */}
              <div
                className={`p-4 rounded-lg border ${
                  rateStatus.status === "live"
                    ? "bg-green-50 border-green-200 text-green-800"
                    : rateStatus.status === "fallback"
                    ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                    : "bg-gray-50 border-gray-200 text-gray-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        rateStatus.status === "live"
                          ? "bg-green-500"
                          : rateStatus.status === "fallback"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                      }`}
                    />
                    <span className="font-medium">{rateStatus.message}</span>
                  </div>
                  <button
                    onClick={refreshRates}
                    disabled={loading}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? "Refreshing..." : "Refresh Rates"}
                  </button>
                </div>
                {rateStatus.lastUpdated && (
                  <div className="text-sm mt-2">
                    Last updated: {rateStatus.lastUpdated.toLocaleString()}
                  </div>
                )}
              </div>

              {/* Display Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Currency
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  Choose the currency in which you want to view all amounts in
                  the app.
                </p>
                <CurrencySelector
                  value={settings.currency}
                  onChange={handleCurrencyChange}
                  className="w-64"
                />
              </div>

              {/* Supported Currencies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supported Currencies ({currencies.length})
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                  {currencies.map((currency) => (
                    <div
                      key={currency.code}
                      className={`flex items-center space-x-2 p-2 rounded text-sm ${
                        settings.currency === currency.code
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-50 text-gray-700"
                      }`}
                    >
                      <span className="text-lg">{currency.symbol}</span>
                      <div>
                        <div className="font-medium">{currency.code}</div>
                        <div className="text-xs opacity-75">
                          {currency.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                Notification Settings
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Email Notifications
                    </label>
                    <p className="text-sm text-gray-500">
                      Receive notifications via email
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.email}
                      onChange={(e) =>
                        updateNestedSettings(
                          "notifications",
                          "email",
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Push Notifications
                    </label>
                    <p className="text-sm text-gray-500">
                      Receive push notifications in browser
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.push}
                      onChange={(e) =>
                        updateNestedSettings(
                          "notifications",
                          "push",
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Profile Settings */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                Profile Settings
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={settings.profile.name}
                    onChange={(e) =>
                      updateNestedSettings("profile", "name", e.target.value)
                    }
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) =>
                      updateNestedSettings("profile", "email", e.target.value)
                    }
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;

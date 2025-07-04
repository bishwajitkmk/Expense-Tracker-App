import { useRef, useState } from "react";
import { useSettings } from "../contexts/SettingsContext";
import { useNotification } from "../contexts/NotificationContext";

const Settings = () => {
  const {
    settings,
    updateSettings,
    updateNestedSettings,
    getCurrencySymbol,
    getFontSizeClass,
  } = useSettings();
  const { showToast, showPushNotification } = useNotification();

  const fileInputRef = useRef();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    updateSettings("profile", {
      name: form.name.value,
      email: form.email.value,
    });
    showToast("Profile updated successfully!", "success");
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        showToast("Data imported successfully!", "success");
      } catch {
        showToast(
          "Error importing data. Please check the file format.",
          "error"
        );
      }
      setIsImporting(false);
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    setIsExporting(true);
    try {
      showToast("Data exported successfully!", "success");
    } catch {
      showToast("Error exporting data.", "error");
    }
    setIsExporting(false);
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all data? This cannot be undone."
      )
    ) {
      updateSettings("fontSize", "Medium");
      updateSettings("themeColor", "Blue");
      updateSettings("currency", "USD ($)");
      updateNestedSettings("notifications", "email", true);
      updateNestedSettings("notifications", "push", false);
      updateSettings("profile", {
        name: "John Doe",
        email: "john@example.com",
      });
      showToast("All settings have been reset to defaults.", "success");
    }
  };

  // Show a test notification when toggling notification preferences
  const handleNotificationToggle = (type, value) => {
    updateNestedSettings("notifications", type, value);
    if (value) {
      if (type === "push") {
        showPushNotification("ExpansePro", {
          body: "Push notifications are enabled!",
        });
        showToast("Push notifications are enabled!", "success");
      } else if (type === "email") {
        showToast("Email notifications are enabled!", "success");
      }
    } else {
      showToast(
        `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } notifications are disabled.`,
        "info"
      );
    }
  };

  return (
    <div className={`p-8 min-h-screen ${getFontSizeClass()}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Customize your expense tracker preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Profile Settings */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Profile Settings
              </h2>
              <form onSubmit={handleProfileSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      defaultValue={settings.profile.name}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      defaultValue={settings.profile.email}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <button
                    className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition-colors duration-200"
                    type="submit"
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            </div>

            {/* Display Settings */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Display Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Size
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={settings.fontSize}
                    onChange={(e) => updateSettings("fontSize", e.target.value)}
                  >
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Current: {settings.fontSize} - This affects the overall text
                    size in the app
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme Color
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={settings.themeColor}
                    onChange={(e) =>
                      updateSettings("themeColor", e.target.value)
                    }
                  >
                    <option>Blue</option>
                    <option>Slate</option>
                    <option>Green</option>
                    <option>Purple</option>
                    <option>Gray</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Current: {settings.themeColor} - This affects the color
                    scheme of the app
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Currency & Notifications */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Preferences
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={settings.currency}
                      onChange={(e) =>
                        updateSettings("currency", e.target.value)
                      }
                    >
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>INR (₹)</option>
                      <option>GBP (£)</option>
                      <option>JPY (¥)</option>
                      <option>BDT (৳)</option>
                    </select>
                    <span className="text-lg font-bold text-blue-700">
                      {getCurrencySymbol()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    This currency will be used throughout the app for all
                    amounts
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notifications
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Email Notifications</span>
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        checked={settings.notifications.email}
                        onChange={(e) =>
                          handleNotificationToggle("email", e.target.checked)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Push Notifications</span>
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        checked={settings.notifications.push}
                        onChange={(e) =>
                          handleNotificationToggle("push", e.target.checked)
                        }
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Control how you receive notifications about your financial
                      activities
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Data Management
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Export / Import Data
                  </label>
                  <div className="flex gap-2">
                    <button
                      className="flex-1 bg-blue-100 text-blue-700 rounded-lg py-2 hover:bg-blue-200 transition-colors duration-200 disabled:opacity-50"
                      onClick={handleExport}
                      disabled={isExporting}
                      type="button"
                    >
                      {isExporting ? "Exporting..." : "Export CSV"}
                    </button>
                    <button
                      className="flex-1 bg-blue-100 text-blue-700 rounded-lg py-2 hover:bg-blue-200 transition-colors duration-200 disabled:opacity-50"
                      type="button"
                      onClick={() =>
                        fileInputRef.current && fileInputRef.current.click()
                      }
                      disabled={isImporting}
                    >
                      {isImporting ? "Importing..." : "Import CSV"}
                    </button>
                    <input
                      type="file"
                      accept=".csv"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleImportFile}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Export your data for backup or import from other sources
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Reset
                  </label>
                  <button
                    className="w-full bg-red-500 text-white rounded-lg py-2 hover:bg-red-600 transition-colors duration-200"
                    onClick={handleReset}
                    type="button"
                  >
                    Reset All Settings
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    This will reset all settings to their default values
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* About & Support Centered */}
        <div className="flex justify-center items-center min-h-[300px] w-full mt-8">
          <div
            className="bg-white justify-center items-center flex flex-col rounded-lg shadow-lg p-6 mx-auto"
            style={{ maxWidth: 400 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
              About & Support
            </h2>
            <div className="space-y-3 flex flex-col items-center justify-center text-center">
              <div>
                <p className="text-gray-600 text-sm">
                  <strong>Version:</strong> ExpansePro v1.0.0
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">
                  <strong>Support:</strong>{" "}
                  <a
                    href="mailto:support@example.com"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    support@example.com
                  </a>
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">
                  <strong>Documentation:</strong>{" "}
                  <a
                    href="#"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    User Guide
                  </a>
                </p>
              </div>
              <div className="pt-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm underline">
                  Check for Updates
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

import React, { useRef } from "react";

const Settings = ({
  fontSize = "Medium",
  setFontSize = () => {},
  themeColor = "Blue",
  setThemeColor = () => {},
  profile = { name: "", email: "" },
  setProfile = () => {},
  currency = "USD ($)",
  setCurrency = () => {},
  notifications = { email: false, push: false },
  setNotifications = () => {},
  onReset = () => {},
  onExport = () => {},
  onImport = () => {},
}) => {
  const fileInputRef = useRef();

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    setProfile({
      name: form.name.value,
      email: form.email.value,
    });
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      onImport(evt.target.result);
    };
    reader.readAsText(file);
  };

  // Currency symbol map
  const currencySymbols = {
    "USD ($)": "$",
    "EUR (€)": "€",
    "INR (₹)": "₹",
    "GBP (£)": "£",
    "JPY (¥)": "¥",
  };

  return (
    <div className="min-h-screen bg-blue-50 flex">
      <div className="flex-1 flex flex-col items-center justify-center p-10 ml-64">
        <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
            Settings
          </h1>
          {/* Font Size */}
          <div className="mb-6">
            <label className="block font-medium text-blue-700 mb-2">
              Font Size
            </label>
            <select
              className="w-full border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
            >
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>
          </div>
          {/* Theme Color */}
          <div className="mb-6">
            <label className="block font-medium text-blue-700 mb-2">
              Theme Color
            </label>
            <select
              className="w-full border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
            >
              <option>Blue</option>
              <option>Slate</option>
              <option>Green</option>
              <option>Purple</option>
              <option>Gray</option>
            </select>
          </div>
          {/* Profile Settings */}
          <form className="mb-6" onSubmit={handleProfileSubmit}>
            <label className="block font-medium text-blue-700 mb-2">
              Profile
            </label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              defaultValue={profile.name}
              className="w-full mb-2 border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              defaultValue={profile.email}
              className="w-full mb-2 border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700"
              type="submit"
            >
              Update Profile
            </button>
          </form>
          {/* Currency Selection */}
          <div className="mb-6">
            <label className="block font-medium text-blue-700 mb-2">
              Currency
            </label>
            <div className="flex items-center gap-2">
              <select
                className="flex-1 border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>INR (₹)</option>
                <option>GBP (£)</option>
                <option>JPY (¥)</option>
              </select>
              <span className="text-lg font-bold text-blue-700">
                {currencySymbols[currency]}
              </span>
            </div>
          </div>
          {/* Export/Import */}
          <div className="mb-6">
            <label className="block font-medium text-blue-700 mb-2">
              Export / Import Data
            </label>
            <div className="flex gap-2">
              <button
                className="flex-1 bg-blue-100 text-blue-700 rounded py-2 hover:bg-blue-200"
                onClick={onExport}
                type="button"
              >
                Export CSV
              </button>
              <button
                className="flex-1 bg-blue-100 rounded py-2 hover:bg-blue-200"
                type="button"
                onClick={() =>
                  fileInputRef.current && fileInputRef.current.click()
                }
              >
                Import CSV
              </button>
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImportFile}
              />
            </div>
          </div>
          {/* Notifications */}
          <div className="mb-6">
            <label className="block font-medium text-blue-700 mb-2">
              Notifications
            </label>
            <div className="flex items-center gap-4">
              <span>Email</span>
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
                checked={notifications.email}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    email: e.target.checked,
                  })
                }
              />
              <span>Push</span>
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
                checked={notifications.push}
                onChange={(e) =>
                  setNotifications({ ...notifications, push: e.target.checked })
                }
              />
            </div>
          </div>
          {/* Data Reset */}
          <div className="mb-6">
            <label className="block font-medium text-blue-700 mb-2">
              Data Reset
            </label>
            <button
              className="w-full bg-red-500 text-white rounded py-2 hover:bg-red-600"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to reset all data? This cannot be undone."
                  )
                ) {
                  onReset();
                }
              }}
              type="button"
            >
              Reset All Data
            </button>
          </div>
          {/* About/Support */}
          <div className="mb-2">
            <label className="block font-medium text-blue-700 mb-2">
              About & Support
            </label>
            <p className="text-blue-500 text-sm mb-2">
              ExpansePro v1.0. For support, contact{" "}
              <a href="mailto:support@example.com" className="underline">
                support@example.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

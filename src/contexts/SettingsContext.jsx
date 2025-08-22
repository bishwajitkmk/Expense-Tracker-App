import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  // Load settings from localStorage or use defaults
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("expansePro-settings");
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
    return {
      fontSize: "Medium",
      themeColor: "Blue",
      currency: "USD",
      displayCurrency: "USD ($)",
      notifications: {
        email: true,
        push: false,
      },
      profile: {
        name: "John Doe",
        email: "john@example.com",
      },
    };
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("expansePro-settings", JSON.stringify(settings));
  }, [settings]);

  // Update individual settings
  const updateSettings = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Update nested settings (like notifications)
  const updateNestedSettings = (parentKey, childKey, value) => {
    setSettings((prev) => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [childKey]: value,
      },
    }));
  };

  // Legacy currency symbol mapping (for backward compatibility)
  const currencySymbols = {
    "USD ($)": "$",
    "EUR (€)": "€",
    "INR (₹)": "₹",
    "GBP (£)": "£",
    "JPY (¥)": "¥",
    "BDT (৳)": "৳",
  };

  // Get currency symbol (legacy support)
  const getCurrencySymbol = () => {
    return currencySymbols[settings.displayCurrency] || "$";
  };

  // Get current currency code
  const getCurrencyCode = () => {
    return settings.currency || "USD";
  };

  // Font size mapping
  const fontSizes = {
    Small: "text-sm",
    Medium: "text-base",
    Large: "text-lg",
  };

  const getFontSizeClass = () => {
    return fontSizes[settings.fontSize] || "text-base";
  };

  // Theme color mapping
  const themeColors = {
    Blue: "blue",
    Slate: "slate",
    Green: "green",
    Purple: "purple",
    Gray: "gray",
  };

  const getThemeColorClass = () => {
    return themeColors[settings.themeColor] || "blue";
  };

  const value = {
    settings,
    updateSettings,
    updateNestedSettings,
    getCurrencySymbol,
    getCurrencyCode,
    getFontSizeClass,
    getThemeColorClass,
    currencySymbols,
    fontSizes,
    themeColors,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

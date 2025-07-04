import { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  // Show a toast message
  const showToast = useCallback((message, type = "info", duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  // Show a browser push notification (if allowed)
  const showPushNotification = useCallback((title, options) => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(title, options);
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(title, options);
          }
        });
      }
    }
  }, []);

  return (
    <NotificationContext.Provider value={{ showToast, showPushNotification }}>
      {children}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[9999] px-6 py-3 rounded shadow-lg text-white transition-all duration-300 ${
            toast.type === "success"
              ? "bg-green-600"
              : toast.type === "error"
              ? "bg-red-600"
              : "bg-blue-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
};

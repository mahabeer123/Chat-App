import React, { useEffect } from "react";

const Toast = ({ message, type = "info", onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      default:
        return "ℹ️";
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-700";
      case "error":
        return "bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-700";
      case "warning":
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900 dark:border-yellow-700";
      default:
        return "bg-blue-50 border-blue-200 dark:bg-blue-900 dark:border-blue-700";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "text-green-800 dark:text-green-200";
      case "error":
        return "text-red-800 dark:text-red-200";
      case "warning":
        return "text-yellow-800 dark:text-yellow-200";
      default:
        return "text-blue-800 dark:text-blue-200";
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full`}>
      <div className={`border rounded-lg p-4 shadow-lg ${getBgColor()}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-lg">{getIcon()}</span>
          </div>
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium ${getTextColor()}`}>
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 hover:bg-opacity-75 transition-colors ${getTextColor()}`}
            >
              <span className="text-sm">✕</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast; 
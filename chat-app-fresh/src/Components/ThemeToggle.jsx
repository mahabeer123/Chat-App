import React from "react";
import { toggleTheme } from "../utils/theme";

const ThemeToggle = ({ className = "" }) => {
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors ${className}`}
      title="Toggle theme"
    >
      <span className="text-lg">🌙</span>
    </button>
  );
};

export default ThemeToggle; 
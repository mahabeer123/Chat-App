// Theme management utilities
export const THEME_STORAGE_KEY = 'chat-app-theme';

export const getTheme = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  }
  return 'light';
};

export const setTheme = (theme) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
};

export const toggleTheme = () => {
  const currentTheme = getTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  return newTheme;
};

// Initialize theme on load
export const initializeTheme = () => {
  const theme = getTheme();
  setTheme(theme);
}; 
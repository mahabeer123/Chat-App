import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import ChatPanel from "./ChatPanel";
import ChatWindow from "./ChatWindow";
import Profile from "./Profile";
import ThemeToggle from "./ThemeToggle";
import { logger } from "../utils/logger";
import { useSelector } from "react-redux";

const Home = () => {
  const { userData, logout } = useAuth();
  const unreadCounts = useSelector(state => state.chat.unreadCounts);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate total unread messages
  const totalUnreadMessages = Object.values(unreadCounts).reduce((total, count) => total + count, 0);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Initialize theme
    const theme = localStorage.getItem("theme") || "light";
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Loading Chat App</h3>
          <p className="text-gray-500 dark:text-gray-400">Preparing your messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={userData?.profile_pic || "https://via.placeholder.com/40x40?text=U"}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-200 dark:ring-blue-800"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Chat App
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Welcome back, {userData?.name || "User"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Total Unread Messages Badge */}
            {totalUnreadMessages > 0 && (
              <div className="relative">
                <div className="bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold">
                  {totalUnreadMessages > 99 ? "99+" : totalUnreadMessages}
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            )}
            <button
              onClick={() => setShowProfile(true)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
              title="Profile Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <ThemeToggle />
            <button
              onClick={logout}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Chat Panel */}
        <div className="w-80 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border-r border-gray-200/50 dark:border-gray-700/50">
          <ChatPanel
            selectedContact={selectedContact}
            onContactSelect={handleContactSelect}
          />
        </div>

        {/* Chat Window */}
        <div className="flex-1">
          <ChatWindow 
            selectedContact={selectedContact} 
            onContactSelect={handleContactSelect}
          />
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
            <Profile onClose={() => setShowProfile(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
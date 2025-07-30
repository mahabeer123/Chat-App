import React, { useMemo, memo, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { logger } from "../utils/logger";

// Memoize the UserCard component to prevent unnecessary re-renders
const UserCard = memo(({ contact, isSelected, onClick }) => {
  const { userData } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Memoize the online status and last seen text to prevent unnecessary re-renders
  const { isOnline, lastSeenText } = useMemo(() => {
    // Only show online if explicitly set to true and not null/undefined
    const isOnline = contact.isOnline === true;
    
    // Format the last seen text
    let lastSeenText;
    if (isOnline) {
      lastSeenText = "Online";
    } else {
      const formattedTime = formatLastSeen(contact.lastSeen);
      lastSeenText = `Last seen ${formattedTime}`;
    }
    
    return { isOnline, lastSeenText };
  }, [contact.isOnline, contact.lastSeen]);

  // Memoize the unread count to prevent unnecessary calculations
  const unreadCount = useMemo(() => {
    return contact.unreadCount || 0;
  }, [contact.unreadCount]);

  // Memoize the profile picture to prevent unnecessary re-renders
  const profilePic = useMemo(() => {
    return contact.profile_pic || "https://via.placeholder.com/40x40/667eea/ffffff?text=" + (contact.name?.charAt(0) || "U");
  }, [contact.profile_pic, contact.name]);

  // Memoize the contact name to prevent unnecessary re-renders
  const displayName = useMemo(() => {
    return contact.name || "Unknown User";
  }, [contact.name]);

  // Memoize the status text to prevent unnecessary re-renders
  const statusText = useMemo(() => {
    return contact.status || "Hey there! I'm using Chat App.";
  }, [contact.status]);

  // Memoize the last message time to prevent unnecessary re-renders
  const lastMessageTime = useMemo(() => {
    if (!contact.lastMessageTime) return "";
    return formatLastSeen(contact.lastMessageTime);
  }, [contact.lastMessageTime]);

  const handleClick = () => {
    if (onClick) {
      onClick(contact);
    }
  };

  const handleProfileClick = (e) => {
    e.stopPropagation(); // Prevent triggering the card click
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
  };

  // ESC key handler for closing modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && showProfileModal) {
        closeProfileModal();
      }
    };

    if (showProfileModal) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showProfileModal]);

  return (
    <>
      <div
        onClick={handleClick}
        className={`flex items-center p-3 cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg ${
          isSelected ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500" : ""
        }`}
      >
        {/* Profile Picture */}
        <div className="relative flex-shrink-0">
          <img
            src={profilePic}
            alt={displayName}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 cursor-pointer hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/40x40/667eea/ffffff?text=${displayName.charAt(0)}`;
            }}
            onClick={handleProfileClick}
            title="Click to view profile details"
          />
          {/* Online Status Indicator */}
          {isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
          )}
          {/* Unread Message Badge */}
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
              {unreadCount > 99 ? "99+" : unreadCount}
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="ml-3 flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {displayName}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {lastMessageTime}
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
            {statusText}
          </p>
          <p className={`text-xs ${isOnline ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}>
            {lastSeenText}
          </p>
        </div>
      </div>

      {/* Profile Details Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Details</h3>
                <button
                  onClick={closeProfileModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Profile Picture */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img
                    src={profilePic}
                    alt={displayName}
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/96x96/667eea/ffffff?text=${displayName.charAt(0)}`;
                    }}
                  />
                  {isOnline && (
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 border-3 border-white dark:border-gray-800 rounded-full"></div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {displayName}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {contact.email || "Not available"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {statusText}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Online Status
                  </label>
                  <p className={`text-sm font-medium ${isOnline ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}>
                    {lastSeenText}
                  </p>
                </div>

                {contact.createdAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Member Since
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatMemberSince(contact.createdAt)}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    closeProfileModal();
                    handleClick();
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send Message
                </button>
                <button
                  onClick={closeProfileModal}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

// Add display name for debugging
UserCard.displayName = "UserCard";

// Helper function to format last seen time
function formatLastSeen(lastSeen) {
  if (!lastSeen) return "Recently";
  
  // If it's already a formatted string, return it
  if (typeof lastSeen === "string" && lastSeen.includes(":")) {
    return lastSeen;
  }
  
  // If it's a timestamp, format it
  if (lastSeen instanceof Date || typeof lastSeen === "number") {
    const date = new Date(lastSeen);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }
  
  return "Recently";
}

// Helper function to format member since date
function formatMemberSince(createdAt) {
  if (!createdAt) return "Recently";
  
  try {
    const date = createdAt instanceof Date ? createdAt : new Date(createdAt);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 1) return "Today";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  } catch (error) {
    return "Recently";
  }
}

export default UserCard;
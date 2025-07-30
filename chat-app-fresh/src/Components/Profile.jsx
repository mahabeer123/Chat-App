import React, { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { useAuth } from "./AuthContext";
import { logger } from "../utils/logger";

const Profile = ({ onClose }) => {
  const { userData, setUserData } = useAuth();
  const [formData, setFormData] = useState({
    name: userData?.name || "",
    status: userData?.status || ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData({
      name: userData?.name || "",
      status: userData?.status || ""
    });
  }, [userData]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      // Use userData.uid if available, otherwise use userData.id
      const userId = userData?.uid || userData?.id;
      if (!userId) {
        setError("User ID not found");
        return;
      }

      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        name: formData.name.trim(),
        status: formData.status.trim()
      });

      setUserData(prev => ({
        ...prev,
        name: formData.name.trim(),
        status: formData.status.trim()
      }));

      logger.info("Profile updated successfully");
      onClose();
    } catch (error) {
      logger.error("Error updating profile:", error);
      setError("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      setError("");

      // Use userData.uid if available, otherwise use userData.id
      const userId = userData?.uid || userData?.id;
      if (!userId) {
        setError("User ID not found");
        return;
      }

      console.log("Attempting to upload image for user:", userId);
      // Upload image to Firebase Storage
      const timestamp = Date.now();
      const storageRef = ref(storage, `users/${userId}/profile.jpg`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update user document
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        profile_pic: downloadURL
      });

      setUserData(prev => ({
        ...prev,
        profile_pic: downloadURL
      }));

      logger.info("Profile picture updated successfully");
    } catch (error) {
      logger.error("Error uploading image:", error);
      console.error("Upload error details:", error);
      
      // Provide more specific error messages
      let errorMessage = "Failed to upload image. Please try again.";
      if (error.code === 'storage/unauthorized') {
        errorMessage = "Permission denied. Please check your Firebase Storage rules.";
      } else if (error.code === 'storage/quota-exceeded') {
        errorMessage = "Storage quota exceeded. Please try a smaller image.";
      } else if (error.code === 'storage/invalid-format') {
        errorMessage = "Invalid image format. Please use JPG, PNG, or GIF.";
      }
      
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Profile Picture */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <img
            src={userData?.profile_pic || "https://via.placeholder.com/120x120?text=U"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-200 dark:ring-blue-800"
          />
          <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              type="file"
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*"
              disabled={isUploading}
            />
          </label>
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Click the camera icon to change your profile picture
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Display Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status Message
          </label>
          <textarea
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            rows="3"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            placeholder="What's on your mind?"
          />
        </div>

        {/* User Info */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Account Information</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-400">{userData?.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Member since {userData?.createdAt ? 
                  (userData.createdAt.toDate ? 
                    userData.createdAt.toDate().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 
                    new Date(userData.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })
                  ) : 
                  "Recently"
                }
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            onClick={handleSave}
            disabled={isSaving || !formData.name.trim()}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            {isSaving ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </div>
            ) : (
              "Save Changes"
            )}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

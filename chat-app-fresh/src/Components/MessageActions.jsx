import React, { useState, useRef, useEffect } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";
import { logger } from "../utils/logger";

const MessageActions = ({ message, selectedContact }) => {
  const { userData } = useAuth();
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);
  const actionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEdit = async () => {
    if (!editText.trim() || editText === message.text || !selectedContact) {
      setIsEditing(false);
      return;
    }

    try {
      const chatId = [userData.id, selectedContact.id].sort().join("_");
      const messageRef = doc(db, "chats", chatId, "messages", message.id);
      await updateDoc(messageRef, {
        text: editText.trim(),
        edited: true,
        editedAt: new Date()
      });

      setIsEditing(false);
      logger.info("Message edited successfully");
    } catch (error) {
      logger.error("Error editing message:", error);
      console.error("Message edit failed:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this message?") || !selectedContact) return;

    try {
      const chatId = [userData.id, selectedContact.id].sort().join("_");
      const messageRef = doc(db, "chats", chatId, "messages", message.id);
      await updateDoc(messageRef, {
        text: "This message was deleted",
        deleted: true,
        deletedAt: new Date()
      });
      logger.info("Message deleted successfully");
    } catch (error) {
      logger.error("Error deleting message:", error);
      console.error("Message deletion failed:", error);
    }
  };

  const canEdit = message.senderId === userData?.id && !message.deleted;
  const canDelete = message.senderId === userData?.id && !message.deleted;

  if (!canEdit && !canDelete) return null;

  return (
    <div className="relative" ref={actionsRef}>
      <button
        onClick={() => setShowActions(!showActions)}
        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        title="Message actions"
      >
        ⋯
      </button>

      {showActions && (
        <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-[120px]">
          {canEdit && (
            <button
              onClick={() => {
                setIsEditing(true);
                setShowActions(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              ✏️ Edit
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => {
                handleDelete();
                setShowActions(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
            >
              🗑️ Delete
            </button>
          )}
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Edit Message
            </h3>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              rows="3"
              placeholder="Edit your message..."
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={handleEdit}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                ✅ Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditText(message.text);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700 transition-colors"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageActions; 
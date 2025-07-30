import React, { useState } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";
import { logger } from "../utils/logger";

const REACTIONS = [
  { emoji: "❤️", name: "heart" },
  { emoji: "👍", name: "thumbsUp" },
  { emoji: "👎", name: "thumbsDown" },
  { emoji: "😊", name: "smile" }
];

const MessageReactions = ({ message, selectedContact, onReactionUpdate }) => {
  const { userData } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  // Only show reactions if the current user is the receiver (not the sender)
  const isReceiver = message.senderId !== userData?.id;
  
  // If user is not the receiver, don't show reactions
  if (!isReceiver) {
    return null;
  }

  const handleReaction = async (reactionName) => {
    if (!userData || !selectedContact) return;

    try {
      setIsUpdating(true);
      
      // Create the correct chat path
      const chatId = [userData.id, selectedContact.id].sort().join("_");
      const messageRef = doc(db, "chats", chatId, "messages", message.id);
      const userReaction = `${reactionName}_${userData.id}`;
      
      // Check if user already reacted with this specific reaction
      const hasReacted = message.reactions?.includes(userReaction);
      
      if (hasReacted) {
        // Remove reaction (deselect)
        await updateDoc(messageRef, {
          reactions: arrayRemove(userReaction)
        });
        logger.info(`Reaction removed: ${reactionName}`);
      } else {
        // Remove any existing reaction first (only one reaction allowed)
        const existingReactions = message.reactions || [];
        const userReactions = existingReactions.filter(reaction => 
          reaction.startsWith(`${userData.id}_`) || reaction.endsWith(`_${userData.id}`)
        );
        
        // Remove all existing reactions from this user
        if (userReactions.length > 0) {
          await updateDoc(messageRef, {
            reactions: arrayRemove(...userReactions)
          });
        }
        
        // Add new reaction
        await updateDoc(messageRef, {
          reactions: arrayUnion(userReaction)
        });
        logger.info(`Reaction added: ${reactionName}`);
      }
      
      // Call the update callback if provided
      if (onReactionUpdate) {
        onReactionUpdate();
      }
      
    } catch (error) {
      logger.error("Error updating reaction:", error);
      console.error("Reaction update failed:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getUserReaction = () => {
    if (!message.reactions || !userData) return null;
    
    // Find the user's reaction
    const userReaction = message.reactions.find(reaction => 
      reaction.startsWith(`${userData.id}_`) || reaction.endsWith(`_${userData.id}`)
    );
    
    if (userReaction) {
      // Extract reaction name from the format "reactionName_userId"
      const reactionName = userReaction.split('_')[0];
      return reactionName;
    }
    
    return null;
  };

  const currentUserReaction = getUserReaction();

  // If user has a reaction, show only that emoji
  if (currentUserReaction) {
    const selectedReaction = REACTIONS.find(r => r.name === currentUserReaction);
    return (
      <div className="flex items-center space-x-1 mt-1">
        <button
          onClick={() => handleReaction(currentUserReaction)}
          disabled={isUpdating}
          className={`px-3 py-2 rounded-full text-lg transition-colors bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 ${
            isUpdating ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-200 dark:hover:bg-blue-800"
          }`}
          title={`Remove ${selectedReaction?.name} reaction`}
        >
          {selectedReaction?.emoji}
        </button>
      </div>
    );
  }

  // If no reaction, show all 4 options
  return (
    <div className="flex items-center space-x-1 mt-1">
      {REACTIONS.map((reaction) => (
        <button
          key={reaction.name}
          onClick={() => handleReaction(reaction.name)}
          disabled={isUpdating}
          className={`px-2 py-1 rounded-full text-xs transition-colors bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 ${
            isUpdating ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title={`Add ${reaction.name} reaction`}
        >
          <span className="mr-1">{reaction.emoji}</span>
        </button>
      ))}
    </div>
  );
};

export default MessageReactions; 
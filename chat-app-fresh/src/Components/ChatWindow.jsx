import React, { useState, useEffect, useRef } from "react";
import { collection, addDoc, orderBy, query, onSnapshot, serverTimestamp, doc, getDoc, updateDoc, arrayUnion, writeBatch } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { useAuth } from "./AuthContext";
import { logger } from "../utils/logger";
import MessageReactions from "./MessageReactions";
import MessageActions from "./MessageActions";

const ChatWindow = ({ selectedContact, onContactSelect }) => {
  const { userData } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!selectedContact) return;

    const chatId = [userData.id, selectedContact.id].sort().join("_");
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messageList);
      
      // Mark messages as read when chat is opened
      markMessagesAsRead(messageList);
    }, (error) => {
      logger.error("Error fetching messages:", error);
    });

    return () => unsubscribe();
  }, [selectedContact, userData.id]);

  const markMessagesAsRead = async (messageList) => {
    try {
      const unreadMessages = messageList.filter(
        message => message.senderId !== userData.id && 
        !message.readBy?.includes(userData.id)
      );

      if (unreadMessages.length > 0) {
        const batch = writeBatch(db);
        const chatId = [userData.id, selectedContact.id].sort().join("_");
        const messagesRef = collection(db, "chats", chatId, "messages");

        unreadMessages.forEach(message => {
          const messageRef = doc(messagesRef, message.id);
          const readBy = message.readBy || [];
          if (!readBy.includes(userData.id)) {
            batch.update(messageRef, {
              readBy: [...readBy, userData.id]
            });
          }
        });

        await batch.commit();
      }
    } catch (error) {
      logger.error("Error marking messages as read:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return;

    try {
      setIsSending(true);
      const chatId = [userData.id, selectedContact.id].sort().join("_");
      const messagesRef = collection(db, "chats", chatId, "messages");

      await addDoc(messagesRef, {
        text: newMessage.trim(),
        senderId: userData.id,
        senderName: userData.name,
        timestamp: serverTimestamp(),
        type: "text"
      });

      // Auto-add sender to receiver's contact list
      await addSenderToReceiverContacts(selectedContact.id);

      setNewMessage("");
      logger.info("Message sent successfully");
    } catch (error) {
      logger.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const addSenderToReceiverContacts = async (receiverId) => {
    try {
      const receiverRef = doc(db, "users", receiverId);
      const receiverDoc = await getDoc(receiverRef);
      
      if (receiverDoc.exists()) {
        const receiverData = receiverDoc.data();
        const contacts = receiverData.contacts || [];
        
        // Check if sender is already in contacts
        const senderExists = contacts.some(contact => contact.id === userData.id);
        
        if (!senderExists) {
          // Add sender to receiver's contacts
          const senderContact = {
            id: userData.id,
            name: userData.name || "Unknown User",
            email: userData.email || "",
            profile_pic: userData.profile_pic || "https://via.placeholder.com/40x40?text=U",
            status: userData.status || "Hey there! I'm using Chat App."
          };
          
          await updateDoc(receiverRef, {
            contacts: arrayUnion(senderContact)
          });
          
          logger.info("Sender added to receiver's contacts");
        }
      }
    } catch (error) {
      logger.error("Error adding sender to receiver contacts:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedContact) return;

    try {
      setIsUploading(true);
      
      // Upload file to Firebase Storage
      const storageRef = ref(storage, `users/${userData.id}/chat-files/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Send message with file URL
      const chatId = [userData.id, selectedContact.id].sort().join("_");
      const messagesRef = collection(db, "chats", chatId, "messages");

      await addDoc(messagesRef, {
        text: file.name,
        fileURL: downloadURL,
        fileType: file.type,
        senderId: userData.id,
        senderName: userData.name,
        timestamp: serverTimestamp(),
        type: "file"
      });

      logger.info("File sent successfully");
    } catch (error) {
      logger.error("Error uploading file:", error);
      console.error("File upload error details:", error);
      
      // Provide specific error messages
      let errorMessage = "Failed to upload file. Please try again.";
      if (error.code === 'storage/unauthorized') {
        errorMessage = "Permission denied. Please check your Firebase Storage rules.";
      } else if (error.code === 'storage/quota-exceeded') {
        errorMessage = "Storage quota exceeded. Please try a smaller file.";
      } else if (error.code === 'storage/invalid-format') {
        errorMessage = "Invalid file format. Please use a supported file type.";
      }
      
      // You could add a toast notification here
      alert(errorMessage);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Add ESC key handler
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && selectedContact) {
        onContactSelect(null); // Go back to welcome screen
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedContact, onContactSelect]);

  return (
    <div className="flex-1 flex flex-col h-full">
      {!selectedContact ? (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to Chat App
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Select a contact from the sidebar to start chatting. Your conversations will appear here.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === userData?.id ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.senderId === userData?.id
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                  }`}
                >
                  {message.fileURL && (
                    <div className="mb-2">
                      {message.fileType?.startsWith("image/") ? (
                        <img
                          src={message.fileURL}
                          alt="Shared image"
                          className="max-w-full h-auto rounded-lg"
                        />
                      ) : message.fileType?.startsWith("video/") ? (
                        <video
                          src={message.fileURL}
                          controls
                          className="max-w-full h-auto rounded-lg"
                        />
                      ) : (
                        <a
                          href={message.fileURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          <span>{message.text}</span>
                        </a>
                      )}
                    </div>
                  )}
                  {!message.fileURL && (
                    <div className="text-sm">{message.text}</div>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-75">
                      {message.timestamp?.toDate?.()?.toLocaleTimeString() || "Just now"}
                    </span>
                    <MessageActions message={message} selectedContact={selectedContact} />
                  </div>
                  <MessageReactions 
                    message={message} 
                    selectedContact={selectedContact}
                    onReactionUpdate={() => {
                      // This will trigger a re-render when reactions are updated
                    }}
                  />
                  {/* Show reaction indicator if message has reactions */}
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      💬 Reacted
                    </div>
                  )}
                  {/* Show the actual reaction emoji for the sender */}
                  {message.reactions && message.reactions.length > 0 && message.senderId === userData?.id && (
                    <div className="mt-1">
                      {(() => {
                        const reaction = message.reactions[0]; // Get the first reaction
                        const reactionName = reaction.split('_')[0];
                        const reactionEmoji = {
                          'heart': '❤️',
                          'thumbsUp': '👍',
                          'thumbsDown': '👎',
                          'smile': '😊'
                        }[reactionName];
                        
                        return reactionEmoji ? (
                          <div className="text-lg">{reactionEmoji}</div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input - Only show when contact is selected */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors disabled:opacity-50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Attach file"
              >
                {isUploading ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
              />
              <div className="flex-1">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                  rows="1"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isSending}
                className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                title="Send message"
              >
                {isSending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWindow;

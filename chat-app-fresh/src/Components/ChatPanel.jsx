import React, { useState, useEffect, useMemo, useCallback } from "react";
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, onSnapshot, orderBy, limit, serverTimestamp, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";
import UserCard from "./userCard";
import { logger } from "../utils/logger";
import { useDispatch, useSelector } from "react-redux";
import { incrementUnreadCount, clearUnreadCount, setUnreadCount } from "../store/slices/chatSlice";

const ChatPanel = ({ selectedContact, onContactSelect }) => {
  const { userData, setUserData } = useAuth();
  const dispatch = useDispatch();
  const unreadCounts = useSelector(state => state.chat.unreadCounts);
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showAddContact, setShowAddContact] = useState(false);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContactEmail, setNewContactEmail] = useState("");
  const [addContactError, setAddContactError] = useState("");
  const [error, setError] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredContacts = useMemo(() => {
    if (!debouncedSearchTerm) return contacts;
    return contacts.filter(contact =>
      contact.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [contacts, debouncedSearchTerm]);

  const sortedContacts = useMemo(() => {
    return [...filteredContacts].sort((a, b) => {
      const timeA = a.lastMessageTime || 0;
      const timeB = b.lastMessageTime || 0;
      return timeB - timeA; // Most recent first
    });
  }, [filteredContacts]);

  // Add unread counts to contacts
  const contactsWithUnreadCounts = useMemo(() => {
    return sortedContacts.map(contact => ({
      ...contact,
      unreadCount: unreadCounts[contact.id] || 0
    }));
  }, [sortedContacts, unreadCounts]);

  useEffect(() => {
    if (userData?.contacts) {
      setContacts(userData.contacts);
    }
  }, [userData?.contacts]);

  // Initialize unread counts for all contacts
  useEffect(() => {
    if (!userData?.contacts || userData.contacts.length === 0) return;

    const initializeUnreadCounts = async () => {
      try {
        for (const contact of userData.contacts) {
          const chatId = [userData.id, contact.id].sort().join("_");
          const messagesRef = collection(db, "chats", chatId, "messages");
          const q = query(messagesRef, orderBy("timestamp", "desc"), limit(10));
          
          const snapshot = await getDocs(q);
          let unreadCount = 0;
          
          snapshot.docs.forEach(doc => {
            const message = doc.data();
            // Count messages from this contact that are recent (within last hour)
            // and not from the current user
            if (message.senderId === contact.id && 
                message.senderId !== userData.id &&
                message.timestamp) {
              const messageTime = message.timestamp?.toDate?.()?.getTime() || message.timestamp;
              const currentTime = Date.now();
              const timeDiff = currentTime - messageTime;
              
              // Only count messages from the last hour as unread
              if (timeDiff < 3600000) {
                unreadCount++;
              }
            }
          });
          
          if (unreadCount > 0) {
            dispatch(setUnreadCount({ contactId: contact.id, count: unreadCount }));
          }
        }
      } catch (error) {
        logger.error("Error initializing unread counts:", error);
      }
    };

    initializeUnreadCounts();
  }, [userData?.contacts, userData?.id, dispatch]);

  const updateContact = useCallback((contactId, updatedData) => {
    setContacts(prevContacts => {
      const existingContact = prevContacts.find(c => c.id === contactId);
      if (!existingContact) return prevContacts;
      const hasSignificantChanges = 
        existingContact.isOnline !== updatedData.isOnline ||
        existingContact.lastSeen !== updatedData.lastSeen ||
        existingContact.profile_pic !== updatedData.profile_pic ||
        existingContact.name !== updatedData.name ||
        existingContact.status !== updatedData.status;
      if (!hasSignificantChanges) {
        return prevContacts;
      }
      return prevContacts.map(contact => 
        contact.id === contactId 
          ? { ...contact, ...updatedData }
          : contact
      );
    });
  }, []);

  const handleContactSelect = useCallback((contact) => {
    // Clear unread count when contact is selected
    if (contact && contact.id) {
      dispatch(clearUnreadCount({ contactId: contact.id }));
    }
    
    if (onContactSelect) {
      onContactSelect(contact);
    }
  }, [onContactSelect, dispatch]);

  useEffect(() => {
    if (!userData?.contacts || userData.contacts.length === 0) return;
    const contactIds = userData.contacts.map(contact => contact.id);
    const unsubscribes = [];
    const updateThrottles = new Map();

    contactIds.forEach(contactId => {
      const userRef = doc(db, "users", contactId);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          const contactData = doc.data();
          if (updateThrottles.has(contactId)) {
            clearTimeout(updateThrottles.get(contactId));
          }
          const throttleTimeout = setTimeout(() => {
            const updatedContact = {
              id: contactId,
              name: contactData.name || "Unknown User",
              email: contactData.email || "",
              profile_pic: contactData.profile_pic || "",
              status: contactData.status || "Hey there! I'm using Chat App.",
              isOnline: contactData.isOnline || false,
              lastSeen: contactData.lastSeen || "Just now",
              lastUpdated: contactData.lastUpdated,
              profileUpdatedAt: contactData.profileUpdatedAt
            };
            updateContact(contactId, updatedContact);
            updateThrottles.delete(contactId);
          }, 100); // 100ms throttle
          updateThrottles.set(contactId, throttleTimeout);
        }
      }, (error) => { console.error("Error listening to contact updates for", contactId, ":", error); });
      unsubscribes.push(unsubscribe);
    });
    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
      updateThrottles.forEach(timeout => clearTimeout(timeout));
    };
  }, [userData?.contacts, updateContact]);

  useEffect(() => {
    if (!contacts || contacts.length === 0) return;
    const unsubscribes = [];
    const messageUpdateThrottles = new Map();
    contacts.forEach(contact => {
      const chatId = [userData.id, contact.id].sort().join("_");
      const messagesRef = collection(db, "chats", chatId, "messages");
      const q = query(messagesRef, orderBy("timestamp", "desc"), limit(1));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const lastMessage = snapshot.docs[0].data();
          const lastMessageTime = lastMessage.timestamp?.toDate?.()?.getTime() || lastMessage.timestamp;
          
          // Check if this is a new message from someone else
          if (lastMessage.senderId !== userData.id && lastMessage.timestamp) {
            const messageTime = lastMessage.timestamp?.toDate?.()?.getTime() || lastMessage.timestamp;
            const currentTime = Date.now();
            const timeDiff = currentTime - messageTime;
            
            // Only increment unread count if:
            // 1. Message is recent (within last 10 minutes)
            // 2. Current chat is not with this contact
            // 3. Message hasn't been processed before (check by timestamp)
            if (timeDiff < 600000 && selectedContact?.id !== contact.id) {
              // Check if we've already processed this message
              const lastProcessedTime = localStorage.getItem(`lastProcessed_${contact.id}`);
              if (!lastProcessedTime || parseInt(lastProcessedTime) < messageTime) {
                dispatch(incrementUnreadCount({ contactId: contact.id }));
                localStorage.setItem(`lastProcessed_${contact.id}`, messageTime.toString());
              }
            }
          }
          
          if (messageUpdateThrottles.has(contact.id)) {
            clearTimeout(messageUpdateThrottles.get(contact.id));
          }
          const throttleTimeout = setTimeout(() => {
            setContacts(prevContacts => 
              prevContacts.map(prevContact => 
                prevContact.id === contact.id && prevContact.lastMessageTime !== lastMessageTime
                  ? { ...prevContact, lastMessageTime }
                  : prevContact
              )
            );
            messageUpdateThrottles.delete(contact.id);
          }, 200); // 200ms throttle for message updates
          messageUpdateThrottles.set(contact.id, throttleTimeout);
        }
      }, (error) => { console.error("Error listening to message updates for contact", contact.id, ":", error); });
      unsubscribes.push(unsubscribe);
    });
    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
      messageUpdateThrottles.forEach(timeout => clearTimeout(timeout));
    };
  }, [contacts, userData?.id, selectedContact?.id, dispatch]);

  const handleAddContact = async () => {
    if (!newContactEmail.trim()) {
      setAddContactError("Please enter an email address");
      return;
    }

    const email = newContactEmail.trim().toLowerCase();
    setIsAddingContact(true);
    setAddContactError("");

    try {
      // Check if user exists
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // User doesn't exist, show invite modal
        setInviteEmail(email);
        setShowInviteModal(true);
        setShowAddContact(false);
        setNewContactEmail("");
        return;
      }

      // User exists, add to contacts
      const userDoc = querySnapshot.docs[0];
      const contactData = userDoc.data();
      const contactId = userDoc.id;

      // Check if already in contacts
      const isAlreadyContact = userData.contacts?.some(contact => contact.id === contactId);
      if (isAlreadyContact) {
        setAddContactError("This contact is already in your list");
        return;
      }

      // Add to contacts
      const newContact = {
        id: contactId,
        name: contactData.name || "Unknown User",
        email: contactData.email || "",
        profile_pic: contactData.profile_pic || "",
        status: contactData.status || "Hey there! I'm using Chat App.",
        isOnline: contactData.isOnline || false,
        lastSeen: contactData.lastSeen || "Just now"
      };

      await updateDoc(doc(db, "users", userData.id), {
        contacts: arrayUnion(newContact),
        lastUpdated: serverTimestamp()
      });

      setUserData(prev => ({
        ...prev,
        contacts: [...(prev.contacts || []), newContact]
      }));

      setNewContactEmail("");
      setShowAddContact(false);
      setAddContactError("");
    } catch (error) {
      logger.error("Failed to add contact", { error: error.message, email });
      setAddContactError("Failed to add contact. Please try again.");
    } finally {
      setIsAddingContact(false);
    }
  };

  const sendInviteEmail = async () => {
    if (!inviteEmail.trim()) {
      return;
    }

    setIsSendingInvite(true);

    try {
      // Show simple message that user is not registered
      alert(`User ${inviteEmail} is not registered in the app.`);
      
      setShowInviteModal(false);
      setInviteEmail("");
      setInviteMessage("");
    } catch (error) {
      logger.error("Failed to process invite", { error: error.message });
      alert("Failed to process invite. Please try again.");
    } finally {
      setIsSendingInvite(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Messages
        </h2>
        <button
          onClick={() => setShowAddContact(true)}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Add new contact"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto space-y-1 p-2">
        {contactsWithUnreadCounts.length > 0 ? (
          contactsWithUnreadCounts.map((contact) => (
            <div key={`${contact.id}-${contact.lastUpdated?.seconds || contact.profileUpdatedAt?.seconds || 'stable'}`} className="transition-all duration-200 ease-in-out">
              <UserCard
                key={`${contact.id}-${contact.lastUpdated?.seconds || contact.profileUpdatedAt?.seconds || 'stable'}`}
                contact={contact}
                isSelected={selectedContact?.id === contact.id}
                onClick={() => handleContactSelect(contact)}
              />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-lg font-medium">No contacts found</p>
            <p className="text-sm text-center mt-2">Add contacts to start chatting</p>
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      {showAddContact && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Contact</h3>
                <button
                  onClick={() => {
                    setShowAddContact(false);
                    setNewContactEmail("");
                    setAddContactError("");
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {addContactError && (
                  <p className="text-red-500 text-sm">{addContactError}</p>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={handleAddContact}
                    disabled={isAddingContact}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isAddingContact ? "Adding..." : "Add Contact"}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddContact(false);
                      setNewContactEmail("");
                      setAddContactError("");
                    }}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Not Registered</h3>
                <button
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteEmail("");
                    setInviteMessage("");
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    placeholder="This person is not registered yet"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    This user is not registered in the app.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={sendInviteEmail}
                  disabled={isSendingInvite}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSendingInvite ? "Processing..." : "OK"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPanel;
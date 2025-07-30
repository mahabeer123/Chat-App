import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { logger } from "../utils/logger";
import { validateName, validateStatus, validateFile } from "../utils/validation";

// 1. 
const AuthContext = React.createContext();
// hook
export function useAuth() {
    // 3
    return useContext(AuthContext);
}

function AuthWrapper({ children }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    
    useEffect(() => {
        console.log("AuthContext: Starting auth state listener");
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            console.log("AuthContext: Auth state changed", { currentUser: currentUser?.email });
            if (currentUser) {
                try {
                    const docRef = doc(db, "users", currentUser.uid);
                    let docSnap = await getDoc(docRef);

                    // If user doc doesn't exist, create it
                    if (!docSnap.exists()) {
                        console.log("AuthContext: Creating new user document");
                        const timeStamp = new Date().toLocaleString("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                        });
                        await setDoc(docRef, {
                            email: currentUser.email,
                            profile_pic: currentUser.photoURL,
                            name: currentUser.displayName,
                            status: "Hey there! I'm using Chat App.",
                            createdAt: new Date(),
                            isOnline: true, // Set online immediately
                            lastSeen: timeStamp,
                            lastSeenTimestamp: serverTimestamp(),
                            lastUpdated: serverTimestamp()
                        });
                        docSnap = await getDoc(docRef);
                    } else {
                        // Update existing user to be online
                        console.log("AuthContext: Updating existing user to online status");
                        const timeStamp = new Date().toLocaleString("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                        });
                        await updateDoc(docRef, {
                            isOnline: true,
                            lastSeen: timeStamp,
                            lastSeenTimestamp: serverTimestamp(),
                            lastUpdated: serverTimestamp()
                        });
                    }
                    if (docSnap.exists()) {
                        const { profile_pic, email, name, status, createdAt, contacts } = docSnap.data();
                        logger.info("User data loaded", { userId: currentUser?.uid });
                        console.log("AuthContext: User data loaded", { email, name, contactsCount: contacts?.length });
                        // context me jaake save kr dia hai user ka data
                        setUserData({
                            id: currentUser?.uid,
                            profile_pic: profile_pic,
                            email,
                            name,
                            status: status ? status : "Hey there! I'm using Chat App.",
                            createdAt: createdAt || new Date(),
                            contacts: contacts || []
                        });
                        // Don't call updateLastSeen here as we already set it above
                    }
                } catch (error) {
                    console.error("AuthContext: Error loading user data", error);
                    setError("Failed to load user data");
                }
            } else {
                console.log("AuthContext: No user authenticated");
                setUserData(null);
            }
            setLoading(false);
        });
        
        return () => {
            console.log("AuthContext: Cleaning up auth listener");
            unsubscribe();
        };
    }, []);

    const updateLastSeen = async ({ uid }) => {
        try {
            const userId = uid || user?.uid || user?.id;
            if (!userId) return;
            
            console.log("Updating last seen for user:", userId);
            const timeStamp = new Date().toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            });
            
            // Only update lastSeen, don't change isOnline status
            await updateDoc(doc(db, "users", userId), {
                lastSeen: timeStamp,
                lastSeenTimestamp: serverTimestamp(),
                lastUpdated: serverTimestamp()
            });
            console.log("Last seen updated successfully");
        } catch (error) {
            logger.error("Failed to update last seen", { error: error.message, userId: user?.uid || user?.id });
        }
    };

    // Set up online status monitoring
    useEffect(() => {
        if (!userData?.id) return;

        console.log("Setting up online status monitoring for user:", userData.id);

        // Immediately set user as online when component mounts
        const setUserOnline = async () => {
            try {
                const timeStamp = new Date().toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                });

                console.log("Setting user online immediately");
                await updateDoc(doc(db, "users", userData.id), {
                    isOnline: true,
                    lastSeen: timeStamp,
                    lastSeenTimestamp: serverTimestamp(),
                    lastUpdated: serverTimestamp()
                });
                console.log("User set as online successfully");
            } catch (error) {
                console.error("Error setting user online:", error);
            }
        };

        setUserOnline(); // Call immediately

        // Reduce frequency of lastSeen updates to prevent flickering
        const lastSeenInterval = setInterval(() => {
            updateLastSeen({ uid: userData.id });
        }, 120000); // Every 2 minutes instead of 60 seconds to reduce updates

        // Handle page visibility change - only mark offline when user actually leaves
        const handleVisibilityChange = async () => {
            console.log("Visibility changed, hidden:", document.hidden);
            if (document.hidden) {
                // User switched tabs or minimized window - don't mark as offline immediately
                // Only update lastSeen, keep isOnline true for a short period
                try {
                    const timeStamp = new Date().toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                    });
                    console.log("Updating lastSeen due to visibility change (keeping online)");
                    await updateDoc(doc(db, "users", userData.id), {
                        lastSeen: timeStamp,
                        lastSeenTimestamp: serverTimestamp(),
                        lastUpdated: serverTimestamp()
                    });
                } catch (error) {
                    console.error("Error updating lastSeen on visibility change:", error);
                }
            } else {
                // User came back to the tab - ensure they're marked as online
                console.log("User returned to tab - ensuring online status");
                setUserOnline();
            }
        };

        // Handle beforeunload event - this is when user actually leaves
        const handleBeforeUnload = async () => {
            try {
                const timeStamp = new Date().toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                });
                console.log("Setting user offline due to page unload");
                await updateDoc(doc(db, "users", userData.id), {
                    isOnline: false,
                    lastSeen: timeStamp,
                    lastSeenTimestamp: serverTimestamp(),
                    lastUpdated: serverTimestamp()
                });
                console.log("User set as offline on unload successfully");
            } catch (error) {
                console.error("Error setting offline status on unload:", error);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            console.log("Cleaning up online status monitoring");
            clearInterval(lastSeenInterval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [userData?.id]);

    // Cleanup effect to handle component unmounting
    useEffect(() => {
        return () => {
            // If user is still logged in when component unmounts, mark them as offline
            if (userData?.id) {
                console.log("Component unmounting - marking user as offline");
                const timeStamp = new Date().toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                });
                
                // Use sendBeacon for more reliable delivery during page unload
                if (navigator.sendBeacon) {
                    const data = new FormData();
                    data.append('userId', userData.id);
                    data.append('timestamp', timeStamp);
                    data.append('action', 'offline');
                    navigator.sendBeacon('/api/user-status', data);
                }
                
                // Also try to update Firestore directly
                updateDoc(doc(db, "users", userData.id), {
                    isOnline: false,
                    lastSeen: timeStamp,
                    lastSeenTimestamp: serverTimestamp(),
                    lastUpdated: serverTimestamp()
                }).catch(error => {
                    console.error("Error setting offline status on unmount:", error);
                });
            }
        };
    }, [userData?.id]);

    const updateName = async (name) => {
        try {
            const validation = validateName(name);
            if (!validation.isValid) {
                throw new Error(validation.error);
            }

        await updateDoc(doc(db, "users", userData.id), {
                name: validation.sanitized,
        });
        setUserData({
            ...userData,
                name: validation.sanitized,
        });
            logger.info("Name updated successfully", { userId: userData.id, newName: validation.sanitized });
        } catch (error) {
            logger.error("Failed to update name", { error: error.message, userId: userData.id });
            throw error;
        }
    };

    const updateStatus = async (status) => {
        try {
            const validation = validateStatus(status);
            if (!validation.isValid) {
                throw new Error(validation.error);
            }

        await updateDoc(doc(db, "users", userData.id), {
                status: validation.sanitized,
        });
        setUserData({
            ...userData,
                status: validation.sanitized,
        });
            logger.info("Status updated successfully", { userId: userData.id, newStatus: validation.sanitized });
        } catch (error) {
            logger.error("Failed to update status", { error: error.message, userId: userData.id });
            throw error;
        }
    };

    const updatePhoto = async (img) => {
        if (!userData?.id) return;
        
        try {
            const file = img.target.files[0];
            if (!file) return;

            // Validate file
            const validationResult = validateFile(file);
            if (!validationResult.isValid) {
                setError(validationResult.error);
                return;
            }

            setIsUploading(true);
            setError(null);

            console.log("Starting profile picture upload for user:", userData.id);

            // Upload image to Firebase Storage
            const timestamp = Date.now();
            const storageRef = ref(storage, `users/${userData.id}/profile.jpg`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                () => {
                    // on State Changed
                    setIsUploading(true);
                    setError(null);
                    logger.info("Photo upload started", { userId: userData.id });
                },
                (error) => {
                    // on Error
                    const errorMessage = "Unable to upload photo. Please try again.";
                    setError(errorMessage);
                    setIsUploading(false);
                    logger.error("Photo upload failed", { 
                        error: error.message, 
                        userId: userData.id 
                    });
                },
                async () => {
                    // on Success
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        console.log("Profile picture uploaded, URL:", downloadURL);
                        
                        // Update user document with new profile picture
                        const updateData = {
                            profile_pic: downloadURL,
                            lastUpdated: serverTimestamp(),
                            profileUpdatedAt: serverTimestamp(),
                            profileUpdatedAtString: new Date().toISOString() // Add string timestamp for better debugging
                        };
                        
                        console.log("Updating user document with:", updateData);
                        await updateDoc(doc(db, "users", userData.id), updateData);
                        
                        console.log("Profile picture updated in database successfully");
                        
                        // Update local state immediately
                        setUserData(prev => ({
                            ...prev,
                            profile_pic: downloadURL,
                        }));
                        
                        setIsUploading(false);
                        logger.info("Photo updated successfully", { userId: userData.id });
                    } catch (error) {
                        logger.error("Failed to update profile picture in database", { 
                            error: error.message, 
                            userId: userData.id 
                        });
                        setError("Failed to update profile picture");
                        setIsUploading(false);
                    }
                }
            );
        } catch (error) {
            logger.error("Photo upload error", { error: error.message, userId: userData.id });
            setError("Failed to upload photo");
            setIsUploading(false);
        }
    };

    const logout = async () => {
        try {
            // Set user as offline before logging out
            if (userData?.id) {
                console.log("Setting user offline before logout:", userData.id);
                const timeStamp = new Date().toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                });
                
                // Use a synchronous approach to ensure this completes
                await updateDoc(doc(db, "users", userData.id), {
                    isOnline: false,
                    lastSeen: timeStamp,
                    lastSeenTimestamp: serverTimestamp(),
                    lastUpdated: serverTimestamp()
                });
                console.log("User marked as offline successfully");
                
                // Wait a moment to ensure the update is processed
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            // Clear local state first
            setUserData(null);
            
            // Then sign out
            await signOut(auth);
            console.log("Logout completed successfully");
        } catch (error) {
            console.error("Error during logout:", error);
            // Even if there's an error, still sign out
            setUserData(null);
            await signOut(auth);
        }
    };

    const refreshUserData = async () => {
        if (userData?.id) {
            try {
                const docRef = doc(db, "users", userData.id);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const { profile_pic, email, name, status, createdAt, contacts } = docSnap.data();
                    console.log("Refreshed contacts from Firestore:", contacts);
                    setUserData(prev => ({
                        ...prev,
                        contacts: contacts || []
                    }));
                }
            } catch (error) {
                logger.error("Error refreshing user data:", error);
            }
        }
    };

    return <AuthContext.Provider value={{
        setUserData, userData, loading, logout, error, isUploading,
        updateName,
        updateStatus,
        updatePhoto,
        refreshUserData,
    }}>
        {children}
    </AuthContext.Provider>
}

export default AuthWrapper;
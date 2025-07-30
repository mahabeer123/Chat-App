import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { logger } from "../utils/logger";

function ProtectedRoute(props) {
  const { userData, loading } = useAuth();

  console.log("ProtectedRoute: ", { userData: !!userData, loading });

  if (loading) {
    console.log("ProtectedRoute: Showing loading screen");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    console.log("ProtectedRoute: User not authenticated, redirecting to login");
    logger.info("User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  console.log("ProtectedRoute: User authenticated, showing protected content");
  return props.children;
}

export default ProtectedRoute;
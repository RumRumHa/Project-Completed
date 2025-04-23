import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = ({ children, requiredRole = [] }) => {
  const token = Cookies.get("token");
  let userRoles = [];
  
  try {
    const roleStr = Cookies.get("role");
    if (roleStr) {
      userRoles = JSON.parse(roleStr);
    }
  } catch (error) {
    console.error("Error parsing role cookie:", error);
    return <Navigate to="/login" replace />;
  }

  // Check if token exists
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If no specific role is required, just check for token
  if (requiredRole.length === 0) {
    return children;
  }

  // Check if user has required role
  const hasRequiredRole = requiredRole.some(role => userRoles.includes(role));
  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;

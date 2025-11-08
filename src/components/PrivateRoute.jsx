import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // 🚫 No token = not logged in
    return <Navigate to="/" replace />;
  }

  return children;
}
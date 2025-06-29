// src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import type { JSX } from "react";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = useAuthStore((s) => s.token);
  const location = useLocation();

  if (!token) {
    // Redirect to /login, preserving intended path in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

import { type ReactNode, useRef, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { toast } from "react-hot-toast";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const location = useLocation();
  const didToast = useRef(false);

  useEffect(() => {
    if (!token && !didToast.current) {
      toast.error("Please log in to continue");
      didToast.current = true;
    }
  }, [token]);

  if (!token) {
    // send the full location so we can return after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function RequireAdmin({ children }) {
  const { isAdmin, loading, isAuthenticated, authReady } = useAuth();

  // While auth state is being resolved, don't redirect — let auth finish first
  if (loading) return null;

  // If auth has been resolved and user is not authenticated, send to login
  if (authReady && !isAuthenticated) return <Navigate to="/login" replace />;

  // If authenticated but not admin, send back to home
  if (isAuthenticated && !isAdmin) return <Navigate to="/" replace />;

  return children;
}

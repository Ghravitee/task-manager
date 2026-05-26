import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Layout } from "./layout/Layout";

export function ProtectedRoute() {
  const { isAuthenticated, isAuthInitialized } = useAuth();
  const location = useLocation();

  if (!isAuthInitialized) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Layout />;
}

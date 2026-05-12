import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

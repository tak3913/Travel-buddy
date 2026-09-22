import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminRoute({ children }) {
  const { currentUser, ready } = useAuth();
  const location = useLocation();
  if (!ready) return null;
  if (!currentUser) return <Navigate to="/login" replace state={{ from: location }} />;
  if (currentUser.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

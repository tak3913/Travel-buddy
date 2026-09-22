import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { currentUser, ready } = useAuth();
  const location = useLocation();

  // 세션 복원이 끝나기 전에는 잠깐 빈 화면 (깜빡임/오탐 리다이렉트 방지)
  if (!ready) return null;

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

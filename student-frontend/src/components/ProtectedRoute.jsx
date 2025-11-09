import { Navigate } from "react-router-dom";
import { safeStorage } from "../utils/safeStorage";

export default function ProtectedRoute({ children }) {
  const token = safeStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

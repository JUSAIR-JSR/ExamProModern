import { Navigate } from "react-router-dom";
import { safeStorage } from "../safeStorage";

export default function ProtectedRoute({ children }) {
  const token = safeStorage.getItem("token");
  const user = JSON.parse(safeStorage.getItem("user") || "{}");

  if (!token || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

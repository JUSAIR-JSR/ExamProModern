import { Navigate } from "react-router-dom";
import { safeStorage } from "../safeStorage"; // ✅ import added
export default function ProtectedRoute({ children }) {
  const token = safeStorage.getItem("token");
  const user = JSON.parse(safeStorage.getItem("user") || "{}");

  if (!token || user.role !== "teacher") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

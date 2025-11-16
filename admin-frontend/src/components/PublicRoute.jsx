import { Navigate } from "react-router-dom";
import { safeStorage } from "../safeStorage";

export default function PublicRoute({ children }) {
  const token = safeStorage.getItem("token");
  const user = JSON.parse(safeStorage.getItem("user") || "{}");

  // 🚫 If admin is logged in, block login page
  if (token && user.role === "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

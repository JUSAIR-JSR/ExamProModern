import { Navigate } from "react-router-dom";
import { safeStorage } from "../utils/safeStorage";

export default function PublicRoute({ children }) {
  const token = safeStorage.getItem("token");
  const user = JSON.parse(safeStorage.getItem("user") || "{}");

  // If already logged in, redirect to home
  if (token && user.role === "student") {
    return <Navigate to="/" replace />;
  }

  // Otherwise, allow access to login/register
  return children;
}

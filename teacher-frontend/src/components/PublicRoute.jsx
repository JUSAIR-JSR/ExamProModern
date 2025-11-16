import { Navigate } from "react-router-dom";
import { safeStorage } from "../safeStorage";

export default function PublicRoute({ children }) {
  const token = safeStorage.getItem("token");
  const user = JSON.parse(safeStorage.getItem("user") || "{}");

  // If teacher is logged in → block login page
  if (token && user.role === "teacher") {
    return <Navigate to="/" replace />;
  }

  return children;
}

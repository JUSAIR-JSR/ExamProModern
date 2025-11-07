import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token || user.role !== "teacher") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

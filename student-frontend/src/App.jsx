import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ExamList from "./pages/ExamList";
import ExamPage from "./pages/ExamPage";
import ResultPage from "./pages/ResultPage";
import StudentLogin from "./pages/StudentLogin";
import StudentRegister from "./pages/StudentRegister";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute"; // ✅ import added
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="p-6">
        <Routes>
          {/* 🚪 Public (only for non-logged-in users) */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <StudentLogin />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <StudentRegister />
              </PublicRoute>
            }
          />

          {/* 🔒 Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ExamList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exam/:id"
            element={
              <ProtectedRoute>
                <ExamPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/result"
            element={
              <ProtectedRoute>
                <ResultPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

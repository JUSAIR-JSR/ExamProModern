import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import TeacherList from "./pages/TeacherList";
import StudentList from "./pages/StudentList";
import ExamList from "./pages/ExamList";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import { safeStorage } from "./safeStorage";  
export default function App() {
  // Check login state — if a token exists in localStorage
  const isLoggedIn = !!safeStorage.getItem("token");

  return (
    <BrowserRouter>
      {/* ✅ Show Navbar only if logged in */}
      {isLoggedIn && <Navbar />}

      <div className="p-6">
        <Routes>
          {/* 🔑 Public Route */}
          <Route path="/" element={<AdminLogin />} />

          {/* 🔒 Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teachers"
            element={
              <ProtectedRoute>
                <TeacherList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <StudentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exams"
            element={
              <ProtectedRoute>
                <ExamList />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

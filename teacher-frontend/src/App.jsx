import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import ExamList from "./pages/ExamList";
import AddExam from "./pages/AddExam";
import AddQuestion from "./pages/AddQuestion";
import TeacherLogin from "./pages/TeacherLogin";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useState, useEffect } from "react";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // Update when login or logout happens
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      {isLoggedIn && <Navbar />}

      <div className="p-8">
        <Routes>
          <Route path="/login" element={<TeacherLogin />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ExamList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-exam"
            element={
              <ProtectedRoute>
                <AddExam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-exam/:id"
            element={
              <ProtectedRoute>
                <AddExam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage/:id"
            element={
              <ProtectedRoute>
                <AddQuestion />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ExamList from "./pages/ExamList";
import AddExam from "./pages/AddExam";
import AddQuestion from "./pages/AddQuestion";
import TeacherLogin from "./pages/TeacherLogin";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function Layout({ children }) {
  const location = useLocation();

  // ✅ Hide Navbar only on the login page
  const hideNavbar = location.pathname === "/login";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className="p-8">{children}</div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* 🔐 Login route */}
          <Route path="/login" element={<TeacherLogin />} />

          {/* 🔐 Protected routes */}
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
      </Layout>
    </BrowserRouter>
  );
}

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ExamList from "./pages/ExamList";
import AddExam from "./pages/AddExam";
import AddQuestion from "./pages/AddQuestion";
import TeacherLogin from "./pages/TeacherLogin";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute"; // ✅ ADD THIS

function Layout({ children }) {
  const location = useLocation();
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

          {/* 👇 LOGIN route should use PUBLIC ROUTE */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <TeacherLogin />
              </PublicRoute>
            }
          />

          {/* PROTECTED ROUTES */}
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

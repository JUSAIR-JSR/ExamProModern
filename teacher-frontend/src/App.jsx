import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ExamList from "./pages/ExamList";
import AddExam from "./pages/AddExam";
import AddQuestion from "./pages/AddQuestion";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="bg-blue-600 text-white p-4 flex justify-between">
        <h1 className="font-bold">Teacher Dashboard</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Exams</Link>
          <Link to="/add-exam" className="hover:underline">Add Exam</Link>
        </div>
      </nav>

      <div className="p-8">
        <Routes>
          <Route path="/" element={<ExamList />} />
          <Route path="/add-exam" element={<AddExam />} />
          <Route path="/edit-exam/:id" element={<AddExam />} /> {/* ✏️ Edit */}
          <Route path="/manage/:id" element={<AddQuestion />} /> {/* 🛠 Manage */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

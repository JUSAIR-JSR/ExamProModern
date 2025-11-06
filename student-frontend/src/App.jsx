import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ExamList from "./pages/ExamList";
import ExamPage from "./pages/ExamPage";
import ResultPage from "./pages/ResultPage";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="bg-green-600 text-white p-4 flex justify-between">
        <h1 className="font-bold">Student Dashboard</h1>
        <Link to="/" className="hover:underline">Home</Link>
      </nav>

      <div className="p-6">
        <Routes>
          <Route path="/" element={<ExamList />} />
          <Route path="/exam/:id" element={<ExamPage />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function ExamList() {
  const [exams, setExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Load all exams from backend
  useEffect(() => {
    API.get("/exams").then((res) => setExams(res.data));
  }, []);

  // Filter exams by search term
  const filteredExams = exams.filter((exam) =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Available Exams</h2>

      {/* 🔍 Search Input */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search exam by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full max-w-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* 📋 Exam List */}
      {filteredExams.length === 0 ? (
        <p className="text-center text-gray-500">No matching exams found.</p>
      ) : (
        filteredExams.map((exam) => (
          <div
            key={exam._id}
            className="border bg-white p-4 mb-3 rounded shadow hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold">{exam.title}</h3>
            <p className="text-gray-700">{exam.description}</p>
            <p className="text-sm text-gray-600 mt-1">
              Duration: {exam.duration} minutes
            </p>
            <button
              onClick={() => navigate(`/exam/${exam._id}`)}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Start Exam
            </button>
          </div>
        ))
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import API from "../api";

export default function ExamList() {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    const res = await API.get("/exams");
    setExams(res.data);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this exam?")) return;
    await API.delete(`/exams/${id}`);
    loadExams();
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Exam List</h2>
      {exams.length === 0 ? (
        <p>No exams found.</p>
      ) : (
        <ul className="divide-y">
          {exams.map((ex) => (
            <li key={ex._id} className="py-3 flex justify-between">
              <div>
                <p className="font-semibold">{ex.title}</p>
                <p className="text-gray-500">Duration: {ex.duration} mins</p>
              </div>
              <button
                onClick={() => handleDelete(ex._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

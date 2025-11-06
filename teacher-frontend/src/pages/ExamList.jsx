import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function ExamList() {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  const loadExams = async () => {
    const res = await API.get("/exams");
    setExams(res.data);
  };

  const deleteExam = async (id) => {
    if (!confirm("Are you sure to delete this exam?")) return;
    await API.delete(`/exams/${id}`);
    loadExams();
  };

  useEffect(() => {
    loadExams();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">All Exams</h2>

      {exams.length === 0 ? (
        <p>No exams available.</p>
      ) : (
        <div className="space-y-3">
          {exams.map((exam) => (
            <div
              key={exam._id}
              className="p-4 border rounded-lg bg-white shadow flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{exam.title}</h3>
                <p>{exam.description}</p>
                <p className="text-sm text-gray-600">
                  Duration: {exam.duration} min
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/manage/${exam._id}`)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Manage
                </button>

                <button
                  onClick={() => navigate(`/edit-exam/${exam._id}`)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteExam(exam._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

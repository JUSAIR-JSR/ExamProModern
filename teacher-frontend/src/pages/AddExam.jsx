import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";

export default function AddExam() {
  const { id } = useParams(); // edit mode if id exists
  const navigate = useNavigate();

  // 🧱 Form state
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [duration, setDuration] = useState(30);
  const [totalMarks, setTotalMarks] = useState(100);

  // 🧭 Load exam if in edit mode
  useEffect(() => {
    if (id) {
      API.get("/exams")
        .then((res) => {
          const e = res.data.find((exam) => exam._id === id);
          if (e) {
            setTitle(e.title);
            setDesc(e.description || "");
            setDuration(e.duration);
            setTotalMarks(e.totalMarks || 100);
          }
        })
        .catch(() => alert("Failed to load exam data"));
    }
  }, [id]);

  // 💾 Save or update exam
  const handleSave = async () => {
    if (!title.trim()) return alert("Enter exam title");
    if (!duration || duration <= 0) return alert("Enter valid duration");
    if (!totalMarks || totalMarks <= 0) return alert("Enter valid total marks");

    const examData = { title, description: desc, duration, totalMarks };

    try {
      if (id) {
        await API.put(`/exams/${id}`, examData);
        alert("✅ Exam updated successfully!");
      } else {
        await API.post("/exams", examData);
        alert("✅ Exam created successfully!");
      }
      navigate("/");
    } catch (err) {
      console.error("❌ Exam save error:", err.response?.data || err);
      alert("Failed to save exam. Check console for details.");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        {id ? "✏️ Edit Exam" : "📝 Add New Exam"}
      </h2>

      <input
        type="text"
        placeholder="Exam Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 mb-3 rounded"
      />

      <textarea
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        className="w-full border p-2 mb-3 rounded"
      />

      <input
        type="number"
        placeholder="Duration (minutes)"
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
        className="w-full border p-2 mb-3 rounded"
      />

      <input
        type="number"
        placeholder="Total Marks"
        value={totalMarks}
        onChange={(e) => setTotalMarks(Number(e.target.value))}
        className="w-full border p-2 mb-3 rounded"
      />

      <button
        onClick={handleSave}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        {id ? "Update Exam" : "Save Exam"}
      </button>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";

export default function AddExam() {
  const { id } = useParams(); // edit mode if id exists
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    if (id) {
      API.get("/exams").then((res) => {
        const e = res.data.find((exam) => exam._id === id);
        if (e) {
          setTitle(e.title);
          setDesc(e.description);
          setDuration(e.duration);
        }
      });
    }
  }, [id]);

  const handleSave = async () => {
    if (!title) return alert("Enter exam title");
    if (id) {
      await API.post("/exams", { _id: id, title, description: desc, duration }); // Replace with PUT if needed
      alert("Exam updated!");
    } else {
      await API.post("/exams", { title, description: desc, duration });
      alert("Exam added!");
    }
    navigate("/");
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">{id ? "Edit Exam" : "Add Exam"}</h2>

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

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {id ? "Update Exam" : "Save Exam"}
      </button>
    </div>
  );
}

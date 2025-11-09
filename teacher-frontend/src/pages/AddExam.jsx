import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Clock, PenLine, Save, BookOpen } from "lucide-react";
import API from "../api";

export default function AddExam() {
  const { id } = useParams(); // edit mode if id exists
  const navigate = useNavigate();

  // 🧱 Form state
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [duration, setDuration] = useState(30);
  const [totalMarks, setTotalMarks] = useState(100);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-white to-green-50 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-green-100"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 border-b pb-3 border-gray-200">
          <BookOpen
            size={28}
            className={`${
              id ? "text-yellow-500" : "text-blue-600"
            }`}
          />
          <h2
            className={`text-2xl font-bold ${
              id ? "text-yellow-600" : "text-blue-700"
            }`}
          >
            {id ? "✏️ Edit Exam" : "📝 Add New Exam"}
          </h2>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Exam Title
            </label>
            <div className="relative">
              <FileText
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="text"
                placeholder="Enter exam title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <div className="relative">
              <PenLine
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />
              <textarea
                placeholder="Short description of the exam"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                rows={3}
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Duration (in minutes)
            </label>
            <div className="relative">
              <Clock
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="number"
                placeholder="e.g. 60"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Total Marks */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Total Marks
            </label>
            <div className="relative">
              <Save
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="number"
                placeholder="e.g. 100"
                value={totalMarks}
                onChange={(e) => setTotalMarks(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Save Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={loading}
            className={`w-full mt-5 py-2 text-white font-semibold rounded-lg transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : id
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading
              ? "Saving..."
              : id
              ? "Update Exam ✏️"
              : "Save Exam 💾"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

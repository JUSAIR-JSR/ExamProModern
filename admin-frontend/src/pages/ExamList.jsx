import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, BookOpen, Clock, FilePlus2 } from "lucide-react";
import API from "../api";
import { Link } from "react-router-dom";

export default function ExamList() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      setLoading(true);
      const res = await API.get("/exams");
      setExams(res.data);
    } catch (error) {
      console.error("Failed to load exams:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("🗑️ Are you sure you want to delete this exam?")) return;
    await API.delete(`/exams/${id}`);
    setExams(exams.filter((ex) => ex._id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-blue-50 py-12 px-4"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-0">
            <BookOpen size={30} className="text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-800">Manage Exams</h2>
          </div>

          <Link
            to="/add-exam"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            <FilePlus2 size={18} /> Create New Exam
          </Link>
        </div>

        {/* Content */}
        <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl p-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading exams...</p>
          ) : exams.length === 0 ? (
            <p className="text-center text-gray-500">No exams found.</p>
          ) : (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {exams.map((exam) => (
                  <motion.li
                    key={exam._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="relative border border-gray-200 bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 shadow hover:shadow-lg transition"
                  >
                    {/* Exam Info */}
                    <div className="mb-2">
                      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        {exam.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {exam.description || "No description provided."}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                      <Clock size={14} />
                      Duration: <span className="font-semibold text-gray-700">{exam.duration} mins</span>
                    </div>

                    {/* Buttons */}
                    <div className="mt-4 flex justify-between">
                      <Link
                        to={`/edit-exam/${exam._id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        ✏️ Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(exam._id)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm font-medium"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>
    </motion.div>
  );
}

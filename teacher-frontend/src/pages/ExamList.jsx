import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Edit3, Trash2, Settings } from "lucide-react";
import API from "../api";

export default function ExamList() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadExams = async () => {
    try {
      const res = await API.get("/exams");
      setExams(res.data);
    } catch (err) {
      console.error("❌ Failed to load exams:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteExam = async (id) => {
    if (!confirm("Are you sure you want to delete this exam?")) return;
    await API.delete(`/exams/${id}`);
    loadExams();
  };

  useEffect(() => {
    loadExams();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center text-green-700 mb-8"
      >
        📚 All Created Exams
      </motion.h2>

      {exams.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500"
        >
          No exams available.
        </motion.p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam, index) => (
            <motion.div
              key={exam._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/90 border border-green-100 p-5 rounded-2xl shadow-md hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {exam.title}
              </h3>
              <p className="text-gray-600 line-clamp-2 mb-2">
                {exam.description || "No description provided."}
              </p>
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <Clock className="mr-2 text-green-600" size={16} /> Duration:{" "}
                <span className="ml-1 font-medium text-gray-700">
                  {exam.duration} min
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between gap-2 mt-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/manage/${exam._id}`)}
                  className="flex-1 flex items-center justify-center gap-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                  <Settings size={16} /> Manage
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/edit-exam/${exam._id}`)}
                  className="flex-1 flex items-center justify-center gap-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
                >
                  <Edit3 size={16} /> Edit
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => deleteExam(exam._id)}
                  className="flex-1 flex items-center justify-center gap-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                >
                  <Trash2 size={16} /> Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

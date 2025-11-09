import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Clock, Search, Star } from "lucide-react";
import API from "../api";

export default function ExamList() {
  const [exams, setExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await API.get("/exams");
        setExams(res.data);
      } catch (err) {
        console.error("Error loading exams:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const filteredExams = exams.filter((exam) =>
    exam.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        transition={{ duration: 0.4 }}
        className="text-3xl font-extrabold text-center text-green-700 mb-8"
      >
        📚 Available Exams
      </motion.h2>

      {/* 🔍 Search Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center mb-10"
      >
        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-3 top-3 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search exams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-xl py-2 pl-10 pr-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition"
          />
        </div>
      </motion.div>

      {/* 📋 Exam Grid */}
      {filteredExams.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500"
        >
          No matching exams found.
        </motion.p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam, index) => (
            <motion.div
              key={exam._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/90 backdrop-blur border border-green-100 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all"
            >
              <h3 className="text-xl font-semibold flex items-center gap-2 text-green-800">
                <BookOpen size={22} /> {exam.title}
              </h3>
              <p className="text-gray-600 mt-2 line-clamp-2">{exam.description}</p>

              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock size={16} className="text-gray-500" /> {exam.duration} mins
                </span>
                <span className="flex items-center gap-1 text-yellow-500">
                  <Star size={16} /> {exam.difficulty || "Medium"}
                </span>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/exam/${exam._id}`)}
                className="w-full mt-5 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
              >
                Start Exam
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

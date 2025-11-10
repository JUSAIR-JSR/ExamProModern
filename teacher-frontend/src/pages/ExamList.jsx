import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  Edit3, 
  Trash2, 
  Settings, 
  BookOpen,
  Users,
  Award,
  BarChart3,
  Plus,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  Eye,
  FileText
} from "lucide-react";
import API from "../api";

export default function ExamList() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredExams, setFilteredExams] = useState([]);
  const navigate = useNavigate();

  const loadExams = async () => {
    try {
      const res = await API.get("/exams");
      setExams(res.data);
      setFilteredExams(res.data);
    } catch (err) {
      console.error("❌ Failed to load exams:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteExam = async (id) => {
    if (!confirm("Are you sure you want to delete this exam? This action cannot be undone.")) return;
    
    try {
      await API.delete(`/exams/${id}`);
      loadExams();
    } catch (error) {
      alert("Failed to delete exam. Please try again.");
    }
  };

  // Search and filter functionality
  useEffect(() => {
    const filtered = exams.filter(exam =>
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredExams(filtered);
  }, [searchTerm, exams]);

  useEffect(() => {
    loadExams();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your exams...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4"
          >
            <BookOpen className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
            Exam Library
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Manage all your examinations in one place. Create, edit, and monitor your exams effortlessly.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-800">{exams.length}</p>
                <p className="text-sm text-gray-600">Total Exams</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {exams.reduce((acc, exam) => acc + (exam.duration || 0), 0)}
                </p>
                <p className="text-sm text-gray-600">Total Minutes</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {exams.reduce((acc, exam) => acc + (exam.totalMarks || 0), 0)}
                </p>
                <p className="text-sm text-gray-600">Total Marks</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <Award className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-800">-</p>
                <p className="text-sm text-gray-600">Active Students</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8"
        >
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search exams by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors duration-200"
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/add-exam")}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>New Exam</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Exams Grid */}
        <AnimatePresence>
          {filteredExams.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-lg"
            >
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchTerm ? "No exams found" : "No exams created yet"}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchTerm 
                  ? "Try adjusting your search terms or create a new exam."
                  : "Get started by creating your first examination."
                }
              </p>
              {!searchTerm && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/add-exam")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg"
                >
                  Create Your First Exam
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredExams.map((exam, index) => (
                <motion.div
                  key={exam._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Exam Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 line-clamp-2 group-hover:text-gray-900 transition-colors">
                        {exam.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {exam.description || "No description provided"}
                      </p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>

                  {/* Exam Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span>{exam.duration} min</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>{exam.totalMarks || 0} marks</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/manage/${exam._id}`)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-3 rounded-xl transition-all duration-200 text-sm font-medium"
                    >
                      <Settings className="w-4 h-4" />
                      Manage
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/edit-exam/${exam._id}`)}
                      className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-4 rounded-xl transition-all duration-200 text-sm font-medium"
                    >
                      <Edit3 className="w-4 h-4" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteExam(exam._id)}
                      className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2.5 px-4 rounded-xl transition-all duration-200 text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
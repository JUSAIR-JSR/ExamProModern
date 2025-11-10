import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Clock, 
  PenLine, 
  Save, 
  BookOpen, 
  Award,
  Calendar,
  Users,
  ArrowLeft,
  CheckCircle,
  Loader2
} from "lucide-react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🧭 Load exam if in edit mode
  useEffect(() => {
    if (id) {
      setLoading(true);
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
        .catch(() => alert("Failed to load exam data"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  // 💾 Save or update exam
  const handleSave = async () => {
    if (!title.trim()) return alert("Enter exam title");
    if (!duration || duration <= 0) return alert("Enter valid duration");
    if (!totalMarks || totalMarks <= 0) return alert("Enter valid total marks");

    const examData = { title, description: desc, duration, totalMarks };

    try {
      setIsSubmitting(true);
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
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading exam data...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-6 px-3 sm:px-6 lg:py-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Back to Dashboard</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-blue-200/50 p-6 sm:p-8 lg:p-10 border border-white/60"
        >
          {/* Header Section */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
              className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl shadow-lg mb-4 ${
                id 
                  ? "bg-gradient-to-r from-amber-500 to-orange-500" 
                  : "bg-gradient-to-r from-blue-600 to-indigo-600"
              }`}
            >
              <BookOpen className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              {id ? "Edit Exam" : "Create New Exam"}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {id ? "Update your exam details" : "Set up a new examination"}
            </p>
          </div>

          {/* Form Section */}
          <div className="space-y-6">
            {/* Title Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Exam Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter exam title (e.g., 'Mathematics Final Exam')"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-400"
                />
                <FileText className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              </div>
            </motion.div>

            {/* Description Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <PenLine className="w-4 h-4 text-green-600" />
                Description
              </label>
              <div className="relative">
                <textarea
                  placeholder="Provide a brief description of the exam, topics covered, and any special instructions..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-400 resize-none"
                  rows={4}
                />
                <PenLine className="w-5 h-5 text-gray-400 absolute left-4 top-4 transform" />
              </div>
            </motion.div>

            {/* Duration & Marks Grid */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Duration Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  Duration (minutes)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="e.g., 120"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    min="1"
                    className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-400"
                  />
                  <Clock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              {/* Total Marks Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  Total Marks
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="e.g., 100"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    min="1"
                    className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-400"
                  />
                  <Award className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
            </motion.div>

            {/* Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6"
            >
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-700">{duration}</p>
                <p className="text-xs text-blue-600">Minutes</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <Award className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-amber-700">{totalMarks}</p>
                <p className="text-xs text-amber-600">Total Marks</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-700">-</p>
                <p className="text-xs text-green-600">Questions</p>
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="pt-6"
            >
              <motion.button
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                onClick={handleSave}
                disabled={isSubmitting}
                className={`w-full py-4 text-white font-semibold rounded-xl text-lg transition-all duration-200 shadow-lg ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : id
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-200/50"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-200/50"
                }`}
              >
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-3"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Saving Exam...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="ready"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-3"
                    >
                      <Save className="w-5 h-5" />
                      <span>{id ? "Update Exam" : "Create Exam"}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
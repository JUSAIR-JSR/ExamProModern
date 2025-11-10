import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PlusCircle, 
  Save, 
  XCircle, 
  Edit3, 
  Trash2, 
  Image as ImageIcon,
  Brain,
  List,
  CheckCircle,
  FileText,
  Settings,
  Award,
  AlertCircle
} from "lucide-react";
import API from "../api";

export default function AddQuestion() {
  const { id: examId } = useParams();
  const [exam, setExam] = useState(null);
  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [marks, setMarks] = useState(2);
  const [negativeMarks, setNegativeMarks] = useState(0.5);
  const [tier, setTier] = useState("I");
  const [section, setSection] = useState("General");
  const [image, setImage] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [editId, setEditId] = useState(null);

  // Load exam and questions
  useEffect(() => {
    API.get("/exams").then((res) => {
      setExam(res.data.find((e) => e._id === examId));
    });
    loadExamData();
  }, [examId]);

  const loadExamData = async () => {
    const res = await API.get(`/exams/${examId}/questions`);
    setQuestions(res.data);
  };

  const resetForm = () => {
    setText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(0);
    setMarks(2);
    setNegativeMarks(0.5);
    setTier("I");
    setSection("General");
    setImage(null);
    setEditId(null);
  };

  const handleSave = async () => {
    if (!text.trim()) return alert("Enter question text");

    const formData = new FormData();
    formData.append("examId", examId);
    formData.append("text", text);
    formData.append("options", JSON.stringify(options));
    formData.append("correctAnswer", correctAnswer);
    formData.append("marks", marks);
    formData.append("negativeMarks", negativeMarks);
    formData.append("tier", tier);
    formData.append("section", section);
    if (image instanceof File) formData.append("image", image);

    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      if (editId) {
        await API.put(`/exams/questions/${editId}`, formData, config);
        alert("✅ Question updated successfully!");
      } else {
        await API.post(`/exams/questions`, formData, config);
        alert("✅ Question added successfully!");
      }
      resetForm();
      loadExamData();
    } catch (error) {
      console.error("❌ Upload Error:", error);
      alert("Failed to save question.");
    }
  };

  const handleEdit = (q) => {
    setEditId(q._id);
    setText(q.text);
    setOptions(q.options);
    setCorrectAnswer(q.correctAnswer);
    setMarks(q.marks);
    setNegativeMarks(q.negativeMarks);
    setTier(q.tier || "I");
    setSection(q.section || "General");
    setImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this question?")) return;
    await API.delete(`/exams/questions/${id}`);
    loadExamData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-6 px-3 sm:px-6 lg:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-blue-200/50 p-6 sm:p-8 lg:p-10 border border-white/60"
      >
        {/* Header Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4"
          >
            <Brain className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">
            Manage Questions
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {exam?.title || "Loading exam details..."}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl p-4 border border-green-200 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-xl">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{questions.length}</p>
                <p className="text-sm text-gray-600">Total Questions</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-blue-50 to-cyan-100 rounded-2xl p-4 border border-blue-200 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-xl">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {questions.reduce((sum, q) => sum + q.marks, 0)}
                </p>
                <p className="text-sm text-gray-600">Total Marks</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-purple-50 to-violet-100 rounded-2xl p-4 border border-purple-200 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-xl">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{exam?.tier || "I"}</p>
                <p className="text-sm text-gray-600">Exam Tier</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Question Form */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200/60 shadow-lg mb-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Edit3 className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              {editId ? "Edit Question" : "Create New Question"}
            </h3>
          </div>

          <div className="space-y-6">
            {/* Question Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Text
              </label>
              <textarea
                placeholder="Enter your question here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none bg-white/50 backdrop-blur-sm"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Question Image
              </label>
              <motion.label 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 cursor-pointer bg-blue-50 hover:bg-blue-100 border-2 border-dashed border-blue-300 rounded-xl p-4 transition-colors duration-200"
              >
                <ImageIcon className="w-5 h-5 text-blue-600" />
                <span className="text-blue-700 font-medium">
                  {image ? "Change Image" : "Upload Question Image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="hidden"
                />
              </motion.label>
              {image && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-3"
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt="preview"
                    className="w-32 h-24 object-cover border rounded-xl shadow-sm"
                  />
                </motion.div>
              )}
            </div>

            {/* Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Answer Options
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.map((opt, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="relative"
                  >
                    <input
                      type="text"
                      placeholder={`Option ${i + 1}`}
                      value={opt}
                      onChange={(e) =>
                        setOptions(options.map((o, idx) => (idx === i ? e.target.value : o)))
                      }
                      className="w-full border border-gray-300 p-3 pr-10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50"
                    />
                    {correctAnswer === i && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Correct Answer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correct Answer
                </label>
                <select
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50"
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(Number(e.target.value))}
                >
                  {options.map((opt, i) => (
                    <option key={i} value={i}>
                      Option {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Marks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marks
                </label>
                <input
                  type="number"
                  placeholder="Marks"
                  value={marks}
                  onChange={(e) => setMarks(Number(e.target.value))}
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50"
                />
              </div>

              {/* Negative Marks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Negative Marks
                </label>
                <input
                  type="number"
                  placeholder="Negative"
                  step="0.1"
                  value={negativeMarks}
                  onChange={(e) => setNegativeMarks(Number(e.target.value))}
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white/50"
                />
              </div>

              {/* Tier & Section */}
              <div className="sm:col-span-2 lg:col-span-1 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tier
                  </label>
                  <select
                    className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50"
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                  >
                    <option value="I">Tier I</option>
                    <option value="II">Tier II</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section
                  </label>
                  <input
                    type="text"
                    placeholder="Section"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className={`flex items-center justify-center gap-3 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg ${
                  editId
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                }`}
              >
                <motion.div
                  animate={{ rotate: editId ? 0 : 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {editId ? <Save size={20} /> : <PlusCircle size={20} />}
                </motion.div>
                {editId ? "Update Question" : "Add Question"}
              </motion.button>

              {editId && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetForm}
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg"
                >
                  <XCircle size={20} /> 
                  Cancel Edit
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Existing Questions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <List className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Existing Questions ({questions.length})
            </h3>
          </div>

          <AnimatePresence>
            {questions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-200/60"
              >
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No questions added yet.</p>
                <p className="text-gray-400 text-sm mt-2">
                  Start by creating your first question above.
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {questions.map((q, i) => (
                  <motion.div
                    key={q._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -2 }}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        #{i + 1}
                      </span>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(q)}
                          className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-xl transition-colors duration-200"
                          title="Edit Question"
                        >
                          <Edit3 size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(q._id)}
                          className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition-colors duration-200"
                          title="Delete Question"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </div>

                    <p className="text-gray-800 font-medium mb-3 line-clamp-2">
                      {q.text}
                    </p>

                    {q.image && (
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        src={q.image}
                        alt="question"
                        className="w-full h-32 object-cover rounded-xl mb-3 border shadow-sm"
                      />
                    )}

                    <div className="space-y-2 mb-3">
                      {q.options.map((opt, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`flex items-center gap-3 p-2 rounded-lg text-sm ${
                            idx === q.correctAnswer
                              ? "bg-green-50 border border-green-200 text-green-800"
                              : "bg-gray-50 text-gray-700"
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            idx === q.correctAnswer
                              ? "bg-green-500 text-white"
                              : "bg-gray-300 text-gray-600"
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <span className="flex-1 truncate">{opt}</span>
                          {idx === q.correctAnswer && (
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          )}
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-gray-600 pt-3 border-t border-gray-200">
                      <span className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        <span className="text-green-600 font-semibold">+{q.marks}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span className="text-red-600 font-semibold">-{q.negativeMarks}</span>
                      </span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        Tier {q.tier}
                      </span>
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        {q.section}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
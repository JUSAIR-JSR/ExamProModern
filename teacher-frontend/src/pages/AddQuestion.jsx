import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PlusCircle, Save, XCircle, Edit3, Trash2, Image as ImageIcon } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-6 border border-green-100"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
          🧠 Manage Questions — {exam?.title || "Loading..."}
        </h2>

        {/* Question Form */}
        <div className="space-y-4">
          <textarea
            placeholder="Enter question text..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-400 transition"
          />

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
              <ImageIcon size={16} />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="hidden"
              />
              Upload Image
            </label>
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="w-24 h-24 object-cover border rounded-lg"
              />
            )}
          </div>

          {options.map((opt, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) =>
                setOptions(
                  options.map((o, idx) => (idx === i ? e.target.value : o))
                )
              }
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 transition"
            />
          ))}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <select
              className="border p-2 rounded focus:ring-2 focus:ring-green-300"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(Number(e.target.value))}
            >
              {options.map((opt, i) => (
                <option key={i} value={i}>
                  Correct: Option {i + 1}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Marks"
              value={marks}
              onChange={(e) => setMarks(Number(e.target.value))}
              className="border p-2 rounded focus:ring-2 focus:ring-green-300"
            />

            <input
              type="number"
              placeholder="Negative"
              value={negativeMarks}
              onChange={(e) => setNegativeMarks(Number(e.target.value))}
              className="border p-2 rounded focus:ring-2 focus:ring-red-300"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <select
              className="border p-2 rounded focus:ring-2 focus:ring-blue-300"
              value={tier}
              onChange={(e) => setTier(e.target.value)}
            >
              <option value="I">Tier I</option>
              <option value="II">Tier II</option>
            </select>

            <input
              type="text"
              placeholder="Section (e.g. Quant, English)"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="border p-2 rounded focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition ${
                editId
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {editId ? <Save size={18} /> : <PlusCircle size={18} />}
              {editId ? "Update Question" : "Add Question"}
            </motion.button>

            {editId && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={resetForm}
                className="flex items-center justify-center gap-2 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition"
              >
                <XCircle size={18} /> Cancel
              </motion.button>
            )}
          </div>
        </div>

        {/* Existing Questions */}
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            📋 Existing Questions
          </h3>

          {questions.length === 0 ? (
            <p className="text-gray-500">No questions yet.</p>
          ) : (
            <div className="space-y-4">
              {questions.map((q, i) => (
                <motion.div
                  key={q._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
                >
                  <p className="font-semibold text-gray-800">
                    {i + 1}. {q.text}
                  </p>
                  {q.image && (
                    <img
                      src={q.image}
                      alt="question"
                      className="w-32 h-24 object-cover rounded mt-2 border"
                    />
                  )}
                  <ul className="pl-5 mt-2 text-sm text-gray-700 list-disc">
                    {q.options.map((opt, idx) => (
                      <li
                        key={idx}
                        className={
                          idx === q.correctAnswer
                            ? "text-green-700 font-semibold"
                            : ""
                        }
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-600 mt-1">
                    Tier: <b>{q.tier}</b> | Section: <b>{q.section}</b> | Marks:{" "}
                    <span className="text-green-700">+{q.marks}</span> | Neg:{" "}
                    <span className="text-red-700">-{q.negativeMarks}</span>
                  </p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(q)}
                      className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(q._id)}
                      className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ChevronLeft, ChevronRight, Send, CheckCircle } from "lucide-react";
import API from "../api";

export default function ExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  useEffect(() => {
    const fetchExamData = async () => {
      const res = await API.get("/exams");
      const e = res.data.find((x) => x._id === id);
      setExam(e);
      setTimeLeft(e.duration * 60);

      const qRes = await API.get(`/exams/${id}/questions`);
      const randomized = shuffleArray(qRes.data);
      setQuestions(randomized);
    };
    fetchExamData();
  }, [id]);

  useEffect(() => {
    if (submitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted, timeLeft]);

  const handleSelect = (qid, optionIndex) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === qid);
      if (existing) {
        if (existing.selected === optionIndex) {
          return prev.map((a) =>
            a.questionId === qid ? { ...a, selected: null } : a
          );
        }
        return prev.map((a) =>
          a.questionId === qid ? { ...a, selected: optionIndex } : a
        );
      }
      return [...prev, { questionId: qid, selected: optionIndex }];
    });
  };

  const submitExam = async () => {
    const res = await API.post("/responses/submit", {
      examId: id,
      answers,
    });
    setSubmitted(true);
    navigate("/result", { state: { result: res.data } });
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (!exam || questions.length === 0)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading exam...
      </div>
    );

  const q = questions[currentIndex];
  const selected =
    answers.find((a) => a.questionId === q._id)?.selected ?? null;

  const getQuestionStatus = (qid) => {
    const ans = answers.find((a) => a.questionId === qid);
    return ans && ans.selected !== null ? "attempted" : "unattempted";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="md:w-1/4 bg-white shadow-md rounded-2xl p-4 h-fit sticky top-4"
      >
        <h3 className="text-lg font-bold text-green-700 mb-3 text-center">
          Question Tracker
        </h3>

        <div className="grid grid-cols-5 gap-2">
          {questions.map((qObj, i) => {
            const status = getQuestionStatus(qObj._id);
            return (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-9 h-9 rounded-full font-semibold transition-all ${
                  currentIndex === i
                    ? "ring-2 ring-blue-500 bg-blue-100 text-blue-600"
                    : status === "attempted"
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        <div className="mt-4 text-sm text-gray-600 space-y-1 text-center">
          <p>🟩 Attempted</p>
          <p>⚪ Unattempted</p>
          <p>🔵 Current</p>
        </div>
      </motion.div>

      {/* Main Exam Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold text-gray-800">{exam.title}</h1>
          <div className="flex items-center gap-2 text-red-600 font-semibold text-lg">
            <Clock size={20} />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          key={q._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-green-100"
        >
          {/* Image */}
          {q.image ? (
            <div className="relative max-w-sm mx-auto overflow-hidden rounded-lg border mb-4 group">
              <img
                src={q.image}
                alt="question"
                className="transition-transform duration-300 ease-in-out group-hover:scale-110"
              />
            </div>
          ) : null}

          {/* Question Text */}
          <p className="font-semibold text-gray-800 mb-4 whitespace-pre-line leading-relaxed">
            Q{currentIndex + 1}. {q.text}
          </p>

          {/* Options */}
          <div className="grid sm:grid-cols-2 gap-3">
            {q.options.map((opt, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelect(q._id, i)}
                className={`flex items-center border p-3 rounded-xl transition-all ${
                  selected === i
                    ? "border-green-600 bg-green-100 text-green-700"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`w-5 h-5 border-2 rounded-full mr-3 flex items-center justify-center ${
                    selected === i
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-gray-400"
                  }`}
                >
                  {selected === i ? <CheckCircle size={12} /> : ""}
                </span>
                {opt}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-xl hover:bg-gray-300 disabled:opacity-50"
          >
            <ChevronLeft size={18} /> Previous
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={submitExam}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
            >
              <Send size={18} /> Submit Exam
            </button>
          ) : (
            <button
              onClick={() =>
                setCurrentIndex((i) => Math.min(i + 1, questions.length - 1))
              }
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
            >
              Next <ChevronRight size={18} />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

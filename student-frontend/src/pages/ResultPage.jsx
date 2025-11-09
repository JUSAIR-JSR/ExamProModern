import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { Trophy, BarChart3, Home } from "lucide-react";
import confetti from "canvas-confetti";

export default function ResultPage() {
  const location = useLocation();
  const result = location.state?.result;

  useEffect(() => {
    if (result) {
      setTimeout(() => {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      }, 400);
    }
  }, [result]);

  if (!result)
    return (
      <p className="text-center mt-10 text-red-600 text-lg font-semibold">
        No result data found.
      </p>
    );

  // 🧮 Calculations
  const attempted = result.correctCount + result.wrongCount;
  const accuracy =
    attempted > 0 ? ((result.correctCount / attempted) * 100).toFixed(2) : 0;
  const totalMarks = result.detailedResults.reduce((sum, q) => sum + q.marks, 0);
  const percentage =
    totalMarks > 0 ? ((result.score / totalMarks) * 100).toFixed(2) : 0;

  // 📊 Chart Data
  const data = [
    { name: "Correct", value: result.correctCount, fill: "#16a34a" },
    { name: "Wrong", value: result.wrongCount, fill: "#dc2626" },
    { name: "Unattempted", value: result.unattempted, fill: "#9ca3af" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* 🎉 Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-extrabold text-center text-green-700 mb-10 flex items-center justify-center gap-3"
      >
        <Trophy className="text-yellow-500" size={40} />
        Exam Results
      </motion.h1>

      {/* Summary Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-8"
      >
        <div className="grid sm:grid-cols-3 gap-6 text-center">
          <div className="p-4 bg-green-50 rounded-xl">
            <p className="text-3xl font-bold text-green-600">{result.correctCount}</p>
            <p className="font-medium text-gray-700">Correct Answers</p>
          </div>
          <div className="p-4 bg-red-50 rounded-xl">
            <p className="text-3xl font-bold text-red-600">{result.wrongCount}</p>
            <p className="font-medium text-gray-700">Wrong Answers</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl">
            <p className="text-3xl font-bold text-blue-600">
              {result.score.toFixed(2)} / {totalMarks}
            </p>
            <p className="font-medium text-gray-700">Final Score</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold text-blue-700">
            🎯 Accuracy: {accuracy}% | 🏁 Percentage: {percentage}%
          </h2>
          <p className="text-gray-500 mt-1">
            Attempted: {attempted}/{result.totalQuestions}
          </p>
        </div>
      </motion.div>

      {/* Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-8"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <BarChart3 className="text-green-600" /> Performance Overview
        </h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Section-wise Analysis */}
      {result.sectionScores && Object.keys(result.sectionScores).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-bold mb-4 text-indigo-700">
            🧩 Section-wise Analysis
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {Object.entries(result.sectionScores).map(([section, data]) => (
              <div
                key={section}
                className="border p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
              >
                <p className="font-semibold text-green-700">{section}</p>
                <p>
                  Score:{" "}
                  <span className="font-bold text-blue-700">
                    {data.score} / {data.totalMarks}
                  </span>
                </p>
                <p>
                  ✅ {data.correct} | ❌ {data.wrong} | ⚪ {data.unattempted}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Question Review */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📝 Question Review</h2>
        {result.detailedResults.map((q, i) => {
          const userSelected = q.selected;
          const correct = q.correctAnswer;
          let icon = "⚪";
          if (userSelected !== null && userSelected !== undefined) {
            icon = userSelected === correct ? "✅" : "❌";
          }

          return (
            <div
              key={i}
              className="border-b border-gray-200 pb-4 mb-5 bg-gray-50 p-4 rounded-xl"
            >
              {q.image && (
                <div className="relative max-w-sm mx-auto overflow-hidden rounded-lg border mb-3 group">
                  <img
                    src={q.image}
                    alt={`Question ${i + 1}`}
                    className="transition-transform duration-300 ease-in-out group-hover:scale-110"
                  />
                </div>
              )}

              <p className="font-semibold mb-2 text-gray-800 whitespace-pre-line">
                Q{i + 1}. {q.question} {icon}
              </p>

              <ul className="ml-4 list-disc text-sm mb-2">
                {q.options.map((opt, idx) => (
                  <li
                    key={idx}
                    className={`${
                      idx === q.correctAnswer
                        ? "text-green-700 font-semibold"
                        : idx === q.selected && q.selected !== q.correctAnswer
                        ? "text-red-600 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {opt}
                    {idx === q.correctAnswer && (
                      <span className="ml-2 text-xs text-green-600">(Correct)</span>
                    )}
                    {idx === q.selected && idx !== q.correctAnswer && (
                      <span className="ml-2 text-xs text-red-500">(Your Answer)</span>
                    )}
                  </li>
                ))}
              </ul>

              <p className="text-sm text-gray-600">
                Marks: <b>+{q.marks}</b> | Neg: <b>-{q.negativeMarks}</b> | Earned:{" "}
                <span
                  className={`font-bold ${
                    q.earnedMarks > 0
                      ? "text-green-700"
                      : q.earnedMarks < 0
                      ? "text-red-700"
                      : "text-gray-600"
                  }`}
                >
                  {q.earnedMarks > 0 ? `+${q.earnedMarks}` : q.earnedMarks}
                </span>
              </p>
            </div>
          );
        })}
      </motion.div>

      {/* Back to Home */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center mt-10"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <Home size={18} />
          Back to Exams
        </Link>
      </motion.div>
    </div>
  );
}

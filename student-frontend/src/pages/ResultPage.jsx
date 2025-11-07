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

export default function ResultPage() {
  const location = useLocation();
  const result = location.state?.result;

  if (!result)
    return <p className="text-center mt-10 text-red-600">No result data found.</p>;

  // 🧮 Calculations
  const attempted = result.correctCount + result.wrongCount;
  const accuracy =
    attempted > 0 ? ((result.correctCount / attempted) * 100).toFixed(2) : 0;
  const totalMarks = result.detailedResults.reduce((sum, q) => sum + q.marks, 0);
  const percentage =
    totalMarks > 0 ? ((result.score / totalMarks) * 100).toFixed(2) : 0;

  // 📊 Chart Data with colors
  const data = [
    { name: "Correct", value: result.correctCount, fill: "#22c55e" },
    { name: "Wrong", value: result.wrongCount, fill: "#ef4444" },
    { name: "Unattempted", value: result.unattempted, fill: "#9ca3af" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
        📊 Exam Result
      </h1>

      {/* ✅ Summary Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-6 text-center">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm sm:text-base">
          <div className="bg-green-100 p-3 rounded font-semibold">
            ✅ Correct: {result.correctCount}
          </div>
          <div className="bg-red-100 p-3 rounded font-semibold">
            ❌ Wrong: {result.wrongCount}
          </div>
          <div className="bg-gray-100 p-3 rounded font-semibold">
            ⚪ Unattempted: {result.unattempted}
          </div>
          <div className="bg-blue-100 p-3 rounded font-semibold">
            🎯 Attempted: {attempted}/{result.totalQuestions}
          </div>
          <div className="bg-yellow-100 p-3 rounded font-semibold">
            📘 Accuracy: {accuracy}%
          </div>
          <div className="bg-purple-100 p-3 rounded font-semibold">
            🏁 Final Score: {result.score.toFixed(2)} / {totalMarks}
          </div>
        </div>

        <h2 className="text-lg mt-4 font-bold text-blue-600">
          Percentage: {percentage}%
        </h2>
      </div>

      {/* ✅ NEW: Tier-wise Analysis */}
      {result.tierScores && Object.keys(result.tierScores).length > 0 && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            📚 Tier-wise Analysis
          </h2>
          {Object.entries(result.tierScores).map(([tier, data]) => (
            <div
              key={tier}
              className="border-b border-gray-200 p-2 mb-2 last:border-none"
            >
              <p className="font-semibold text-blue-700">Tier {tier}</p>
              <p>
                Score:{" "}
                <span className="font-bold text-green-700">
                  {data.score}
                </span>{" "}
                / {data.totalMarks}
              </p>
              <p>
                ✅ {data.correct} | ❌ {data.wrong} | ⚪ {data.unattempted}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ✅ NEW: Section-wise Analysis */}
      {result.sectionScores && Object.keys(result.sectionScores).length > 0 && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            🧩 Section-wise Analysis
          </h2>
          {Object.entries(result.sectionScores).map(([section, data]) => (
            <div
              key={section}
              className="border-b border-gray-200 p-2 mb-2 last:border-none"
            >
              <p className="font-semibold text-indigo-700">{section}</p>
              <p>
                Score:{" "}
                <span className="font-bold text-green-700">
                  {data.score}
                </span>{" "}
                / {data.totalMarks}
              </p>
              <p>
                ✅ {data.correct} | ❌ {data.wrong} | ⚪ {data.unattempted}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Chart */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2 text-center text-gray-800">
          Performance Overview
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ Detailed Question Review (Your Original Code — Unchanged) */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Question Review
        </h2>

        {result.detailedResults.map((q, i) => {
          const userSelected = q.selected;
          const correct = q.correctAnswer;
          let icon = "⚪"; // Default unattempted
          if (userSelected !== null && userSelected !== undefined) {
            icon = userSelected === correct ? "✅" : "❌";
          }

          return (
            <div
              key={q.questionId}
              className="border-b pb-3 mb-4 bg-gray-50 rounded-md p-3 shadow-sm"
            >
              {q.image && (
                <div className="relative max-w-sm overflow-hidden rounded-lg border group mb-3 mx-auto">
                  <img
                    src={q.image}
                    alt={`Question ${i + 1}`}
                    className="transition-transform duration-300 ease-in-out group-hover:scale-150 group-focus:scale-150"
                    tabIndex={0}
                  />
                </div>
              )}

              <p className="font-semibold mb-1 whitespace-pre-line">
                Q{i + 1}. {q.question} <span>{icon}</span>
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
                      <span className="ml-2 text-xs text-green-600">
                        (Correct)
                      </span>
                    )}
                    {idx === q.selected && idx !== q.correctAnswer && (
                      <span className="ml-2 text-xs text-red-500">
                        (Your Answer)
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              <p className="text-sm text-gray-600">
                Marks: <span className="font-medium">+{q.marks}</span> | Neg:{" "}
                <span className="font-medium">-{q.negativeMarks}</span> | Earned:{" "}
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
      </div>

      {/* ✅ Back Button */}
      <div className="text-center mt-6">
        <Link
          to="/"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Back to Exams
        </Link>
      </div>
    </div>
  );
}

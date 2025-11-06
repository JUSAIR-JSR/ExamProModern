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

  if (!result) return <p>No result data</p>;

  const data = [
    { name: "Correct", value: result.correctCount },
    { name: "Wrong", value: result.wrongCount },
    { name: "Unattempted", value: result.unattempted },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">📊 Exam Result</h1>

      {/* ✅ Summary Card */}
      <div className="bg-white p-4 rounded shadow mb-6 text-center">
        <p>Total Questions: {result.totalQuestions}</p>
        <p className="text-green-600 font-semibold">
          Correct: {result.correctCount}
        </p>
        <p className="text-red-600 font-semibold">Wrong: {result.wrongCount}</p>
        <p className="text-gray-700">Unattempted: {result.unattempted}</p>
        <h2 className="text-2xl mt-4 font-bold text-blue-600">
          Final Score: {result.score}
        </h2>
      </div>

      {/* ✅ Chart */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2 text-center">
          Performance Chart
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#16A34A" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ✅ Question Review Section */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Question Review</h2>

        {result.detailedResults.map((q, i) => {
          const userSelected = q.selected;
          const correct = q.correctAnswer;

          let icon = "⚪"; // unattempted
          if (userSelected !== null) {
            icon = userSelected === correct ? "✅" : "❌";
          }

          return (
            <div
              key={q.questionId}
              className="border-b pb-3 mb-4 bg-gray-50 rounded-md p-3 shadow-sm"
            >
              {/* ✅ Image (Cloudinary Safe Zoom) */}
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

              {/* ✅ Question Text */}
              <p className="font-semibold mb-1 whitespace-pre-line">
                Q{i + 1}. {q.question} <span>{icon}</span>
              </p>

              {/* ✅ Options */}
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
                  </li>
                ))}
              </ul>

              {/* ✅ Marks Info */}
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
                  {q.earnedMarks}
                </span>
              </p>
            </div>
          );
        })}
      </div>

      {/* ✅ Back Button */}
      <div className="text-center mt-6">
        <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded">
          Back to Exams
        </Link>
      </div>
    </div>
  );
}

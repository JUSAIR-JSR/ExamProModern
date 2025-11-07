import { useEffect, useState } from "react";
import API from "../api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({
    totalExams: 0,
    avgScore: 0,
    highestScore: 0,
    avgAccuracy: 0,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await API.get("/responses/my"); // backend endpoint
      setResults(res.data);

      if (res.data.length > 0) {
        const totalExams = res.data.length;
        const totalScore = res.data.reduce((sum, r) => sum + r.score, 0);
        const highestScore = Math.max(...res.data.map((r) => r.score));
        const avgAccuracy =
          res.data.reduce((sum, r) => {
            const attempted = r.correctCount + r.wrongCount;
            return sum + (attempted ? (r.correctCount / attempted) * 100 : 0);
          }, 0) / totalExams;

        setStats({
          totalExams,
          avgScore: (totalScore / totalExams).toFixed(2),
          highestScore: highestScore.toFixed(2),
          avgAccuracy: avgAccuracy.toFixed(2),
        });
      }
    } catch (err) {
      console.error("❌ Error fetching profile data:", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-green-700">
        👤 Student Profile
      </h1>

      {/* User Info */}
      {user && (
        <div className="bg-white shadow p-4 rounded mb-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {user.name}
          </h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      )}

      {/* Analytics Summary */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-bold mb-3 text-gray-800">
          📊 Performance Analytics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-green-100 p-3 rounded font-semibold">
            Total Exams: {stats.totalExams}
          </div>
          <div className="bg-blue-100 p-3 rounded font-semibold">
            Avg Score: {stats.avgScore}
          </div>
          <div className="bg-yellow-100 p-3 rounded font-semibold">
            Highest: {stats.highestScore}
          </div>
          <div className="bg-purple-100 p-3 rounded font-semibold">
            Accuracy: {stats.avgAccuracy}%
          </div>
        </div>
      </div>

      {/* Previous Exam Results */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-bold mb-4 text-gray-800">
          🧾 Previous Exam Results
        </h2>

        {results.length === 0 ? (
          <p className="text-gray-500 text-center">No exams attempted yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                <th className="p-2 border">Exam Name</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Score</th>
                <th className="p-2 border">Correct</th>
                <th className="p-2 border">Wrong</th>
                <th className="p-2 border">Unattempted</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-50 transition text-gray-800 text-sm"
                >
                  <td className="p-2 border">{res.examTitle || "Untitled Exam"}</td>
                  <td className="p-2 border">
                    {new Date(res.submittedAt).toLocaleString()}
                  </td>
                  <td className="p-2 border font-semibold text-blue-700">
                    {res.score.toFixed(2)} / {res.totalMarks}
                  </td>
                  <td className="p-2 border text-green-600">{res.correctCount}</td>
                  <td className="p-2 border text-red-600">{res.wrongCount}</td>
                  <td className="p-2 border text-gray-500">{res.unattempted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

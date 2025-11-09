import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Target, Award, UserCircle } from "lucide-react";
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
      const res = await API.get("/responses/my");
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
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* 👤 Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-8"
      >
        <div className="flex justify-center mb-4">
          <UserCircle className="text-green-600" size={80} />
        </div>
        <h1 className="text-3xl font-bold text-green-700">Student Profile</h1>
        {user && (
          <>
            <p className="text-gray-800 mt-2 text-lg font-semibold">
              {user.name}
            </p>
            <p className="text-gray-500">{user.email}</p>
          </>
        )}
      </motion.div>

      {/* 📊 Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-2xl shadow-lg mb-10"
      >
        <h2 className="text-xl font-bold mb-5 text-gray-800 flex items-center gap-2">
          <BarChart3 className="text-green-600" /> Performance Analytics
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-green-50 p-4 rounded-xl shadow-sm"
          >
            <p className="text-3xl font-bold text-green-600">
              {stats.totalExams}
            </p>
            <p className="text-gray-600 font-medium">Total Exams</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-blue-50 p-4 rounded-xl shadow-sm"
          >
            <p className="text-3xl font-bold text-blue-600">
              {stats.avgScore}
            </p>
            <p className="text-gray-600 font-medium">Average Score</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-yellow-50 p-4 rounded-xl shadow-sm"
          >
            <p className="text-3xl font-bold text-yellow-600">
              {stats.highestScore}
            </p>
            <p className="text-gray-600 font-medium">Highest Score</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-purple-50 p-4 rounded-xl shadow-sm"
          >
            <p className="text-3xl font-bold text-purple-600">
              {stats.avgAccuracy}%
            </p>
            <p className="text-gray-600 font-medium">Average Accuracy</p>
          </motion.div>
        </div>
      </motion.div>

      {/* 🧾 Exam History */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <h2 className="text-xl font-bold mb-5 text-gray-800 flex items-center gap-2">
          <Target className="text-blue-600" /> Previous Exam Results
        </h2>

        {results.length === 0 ? (
          <p className="text-gray-500 text-center">No exams attempted yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-green-100 text-gray-800 text-sm sm:text-base">
                  <th className="p-3 border">Exam Name</th>
                  <th className="p-3 border">Date</th>
                  <th className="p-3 border">Score</th>
                  <th className="p-3 border">Correct</th>
                  <th className="p-3 border">Wrong</th>
                  <th className="p-3 border">Unattempted</th>
                </tr>
              </thead>
              <tbody>
                {results.map((res, i) => (
                  <motion.tr
                    key={i}
                    whileHover={{ scale: 1.01 }}
                    className="hover:bg-gray-50 transition text-gray-800 text-sm"
                  >
                    <td className="p-3 border font-medium">
                      {res.examTitle || "Untitled Exam"}
                    </td>
                    <td className="p-3 border">
                      {new Date(res.submittedAt).toLocaleDateString()}{" "}
                      <span className="text-gray-500 text-xs">
                        {new Date(res.submittedAt).toLocaleTimeString()}
                      </span>
                    </td>
                    <td className="p-3 border font-semibold text-blue-700">
                      {res.score.toFixed(2)} / {res.totalMarks}
                    </td>
                    <td className="p-3 border text-green-600">
                      {res.correctCount}
                    </td>
                    <td className="p-3 border text-red-600">
                      {res.wrongCount}
                    </td>
                    <td className="p-3 border text-gray-500">
                      {res.unattempted}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}

import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="max-w-3xl mx-auto mt-10 text-center">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/teachers" className="bg-blue-500 text-white py-4 rounded">
          👩‍🏫 Teachers
        </Link>
        <Link to="/students" className="bg-green-500 text-white py-4 rounded">
          🎓 Students
        </Link>
        <Link to="/exams" className="bg-purple-500 text-white py-4 rounded">
          📝 Exams
        </Link>
      </div>
    </div>
  );
}

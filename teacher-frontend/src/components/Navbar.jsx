import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="font-bold">Teacher Dashboard</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Exams</Link>
        <Link to="/add-exam" className="hover:underline">Add Exam</Link>
        <button onClick={handleLogout} className="ml-4 bg-red-500 px-2 py-1 rounded">
          Logout
        </button>
      </div>
    </nav>
  );
}

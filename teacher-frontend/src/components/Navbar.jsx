import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, BookOpen, PlusCircle, Home, GraduationCap } from "lucide-react";
import { safeStorage } from "./safeStorage"; // ✅ import added

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(safeStorage.getItem("user") || "{}");

  const handleLogout = () => {
    safeStorage.removeItem("token");
    safeStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-blue-700 to-green-600 text-white shadow-md px-5 py-3 flex items-center justify-between sticky top-0 z-50"
    >
      {/* Logo and Title */}
      <div className="flex items-center gap-2">
        <GraduationCap size={26} className="text-white" />
        <h1 className="text-xl font-extrabold tracking-wide">
          Teacher Dashboard
        </h1>
      </div>

      {/* Links (Desktop) */}
      <div className="hidden sm:flex items-center gap-5">
        <Link
          to="/"
          className="flex items-center gap-1 hover:text-yellow-300 transition"
        >
          <Home size={18} /> Home
        </Link>

        <Link
          to="/add-exam"
          className="flex items-center gap-1 hover:text-yellow-300 transition"
        >
          <PlusCircle size={18} /> Add Exam
        </Link>

        <Link
          to="/exams"
          className="flex items-center gap-1 hover:text-yellow-300 transition"
        >
          <BookOpen size={18} /> All Exams
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Mobile Menu */}
      <div className="sm:hidden flex items-center gap-3">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 p-2 rounded-lg"
        >
          <LogOut size={18} />
        </button>
      </div>
    </motion.nav>
  );
}

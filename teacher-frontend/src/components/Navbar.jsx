import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  BookOpen,
  PlusCircle,
  Home,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";
import { safeStorage } from "../safeStorage";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(safeStorage.getItem("user") || "{}");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

      {/* Desktop Links */}
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

      {/* Mobile Menu Toggle Button */}
      <button
        className="sm:hidden bg-blue-800 p-2 rounded-md hover:bg-blue-900 transition"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute top-[65px] left-0 w-full bg-gradient-to-r from-blue-700 to-green-600 text-white shadow-md sm:hidden z-40"
          >
            <div className="flex flex-col items-center py-3 gap-3">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 hover:text-yellow-300 transition"
              >
                <Home size={18} /> Home
              </Link>

              <Link
                to="/add-exam"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 hover:text-yellow-300 transition"
              >
                <PlusCircle size={18} /> Add Exam
              </Link>

              <Link
                to="/exams"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 hover:text-yellow-300 transition"
              >
                <BookOpen size={18} /> All Exams
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg transition"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

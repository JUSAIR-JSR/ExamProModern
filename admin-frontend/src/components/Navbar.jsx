import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // Redirect to login
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-800 text-white shadow-lg sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-5 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Shield className="text-blue-400" size={28} />
          <h1 className="text-xl font-bold tracking-wide">
            Admin Dashboard
          </h1>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-5">
          <NavLink icon={<LayoutDashboard size={18} />} label="Dashboard" to="/dashboard" />
          <NavLink icon={<Users size={18} />} label="Teachers" to="/teachers" />
          <NavLink icon={<GraduationCap size={18} />} label="Students" to="/students" />
          <NavLink icon={<BookOpen size={18} />} label="Exams" to="/exams" />

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg text-sm font-medium transition"
          >
            <LogOut size={16} /> Logout
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white hover:text-blue-300 transition"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-900 border-t border-gray-700"
          >
            <div className="flex flex-col p-4 space-y-3">
              <MobileLink label="Dashboard" to="/dashboard" setMenuOpen={setMenuOpen} />
              <MobileLink label="Teachers" to="/teachers" setMenuOpen={setMenuOpen} />
              <MobileLink label="Students" to="/students" setMenuOpen={setMenuOpen} />
              <MobileLink label="Exams" to="/exams" setMenuOpen={setMenuOpen} />

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-left"
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

/* --- Helper Components --- */

function NavLink({ icon, label, to }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-1 hover:text-blue-300 text-sm font-medium transition"
    >
      {icon} {label}
    </Link>
  );
}

function MobileLink({ label, to, setMenuOpen }) {
  return (
    <Link
      to={to}
      onClick={() => setMenuOpen(false)}
      className="flex items-center gap-2 text-gray-200 hover:text-blue-400 transition"
    >
      • {label}
    </Link>
  );
}

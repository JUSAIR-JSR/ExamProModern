import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogOut, UserCircle, GraduationCap, Menu, X } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  // ✅ Hide navbar on login/register pages
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";
  if (hideNavbar) return null;

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white shadow-md sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left section: Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <GraduationCap className="text-green-600" size={26} />
          <span className="text-xl font-bold text-green-700">
            ExamPro<span className="text-gray-800">Modern</span>
          </span>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`font-medium hover:text-green-700 transition ${
              location.pathname === "/" ? "text-green-700" : "text-gray-700"
            }`}
          >
            Exams
          </Link>

          <Link
            to="/profile"
            className={`font-medium hover:text-green-700 transition ${
              location.pathname === "/profile"
                ? "text-green-700"
                : "text-gray-700"
            }`}
          >
            Profile
          </Link>

          {user && (
            <span className="text-sm text-gray-600 italic">
              Hello, {user.name}
            </span>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border-t border-green-100 md:hidden px-6 pb-4"
        >
          <div className="flex flex-col gap-3 pt-2">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="text-gray-800 hover:text-green-700 font-medium"
            >
              Exams
            </Link>
            <Link
              to="/profile"
              onClick={() => setMobileOpen(false)}
              className="text-gray-800 hover:text-green-700 font-medium"
            >
              Profile
            </Link>

            {user && (
              <span className="text-sm text-gray-600 italic">
                Hello, {user.name}
              </span>
            )}

            <button
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

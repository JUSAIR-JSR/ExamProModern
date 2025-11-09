import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, GraduationCap } from "lucide-react";
import API from "../api";

export default function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      if (res.data.role !== "student") {
        alert("Access denied. Only students can log in.");
        setLoading(false);
        return;
      }
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      alert("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-[90%] sm:w-96"
      >
        {/* Logo and Title */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <GraduationCap className="text-green-600" size={48} />
          </div>
          <h2 className="text-3xl font-bold text-green-700 mb-1">
            Student Login
          </h2>
          <p className="text-gray-500 text-sm">
            Access your dashboard and start your exams
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail
              size={20}
              className="absolute left-3 top-3 text-gray-400"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock
              size={20}
              className="absolute left-3 top-3 text-gray-400"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        {/* Register Link */}
        <p className="mt-5 text-center text-sm text-gray-700">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-green-600 font-medium hover:underline"
          >
            Register here
          </Link>
        </p>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-400">
          <LogIn size={14} className="inline mr-1 text-gray-400" />
          Secure Student Portal © {new Date().getFullYear()}
        </div>
      </motion.div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, GraduationCap } from "lucide-react";
import API from "../api";
import { safeStorage } from "../safeStorage";

export default function TeacherLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post("/auth/login", { email, password });
      if (res.data.role !== "teacher") {
        alert("Access denied. Only teachers can log in.");
        return;
      }
      safeStorage.setItem("token", res.data.token);
      safeStorage.setItem("user", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-green-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 md:p-10 border border-blue-100"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <GraduationCap size={42} className="text-blue-700" />
          </div>
          <h1 className="text-3xl font-bold text-blue-700">Teacher Login</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Access your teaching dashboard securely
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <Mail size={20} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />
          </div>

          <div className="relative">
            <Lock size={20} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-md"
            }`}
          >
            <LogIn size={20} />
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <p className="text-center text-xs md:text-sm text-gray-500 mt-6">
          © {new Date().getFullYear()} ExamPro Modern — Teacher Portal
        </p>
      </motion.div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ShieldCheck, LogIn } from "lucide-react";
import API from "../api";
import { safeStorage } from "../safeStorage";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post("/auth/login", { email, password });

      if (res.data.role !== "admin") {
        alert("Access denied. Only admins can log in.");
        return;
      }

      safeStorage.setItem("token", res.data.token);
      safeStorage.setItem("user", JSON.stringify(res.data));
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-blue-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-200"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center mb-2"
          >
            <ShieldCheck className="text-blue-600" size={42} />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800">Admin Login</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Secure access to your control panel
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              required
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            type="submit"
            className={`w-full py-2 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-md"
            }`}
          >
            <LogIn size={18} />
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} ExamPro Admin Panel • Secure Access
        </p>
      </motion.div>
    </div>
  );
}

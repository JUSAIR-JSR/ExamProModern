import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, UserPlus, GraduationCap } from "lucide-react";
import API from "../api";

export default function StudentRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/register/student", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      alert("🎉 Registration successful!");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-50">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-[90%] sm:w-96"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <GraduationCap className="text-green-600" size={48} />
          </div>
          <h2 className="text-3xl font-bold text-green-700 mb-1">
            Student Registration
          </h2>
          <p className="text-gray-500 text-sm">
            Join and start your learning journey
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name */}
          <div className="relative">
            <User size={20} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail size={20} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock size={20} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className={`w-full font-semibold py-2 rounded-lg text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </motion.button>
        </form>

        {/* Login Redirect */}
        <p className="mt-5 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-600 font-medium hover:underline"
          >
            Login here
          </Link>
        </p>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-400">
          <UserPlus size={14} className="inline mr-1 text-gray-400" />
          Secure Student Registration © {new Date().getFullYear()}
        </div>
      </motion.div>
    </div>
  );
}

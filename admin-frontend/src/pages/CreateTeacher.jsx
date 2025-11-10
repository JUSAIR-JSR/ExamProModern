import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Mail, Lock, CheckCircle, XCircle } from "lucide-react";
import API from "../api";
import { safeStorage } from "../safeStorage";

export default function CreateTeacher({ onTeacherCreated }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const token = safeStorage.getItem("token");
      const res = await API.post("/admin/create-teacher", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStatus({ type: "success", message: res.data.message });
      setForm({ name: "", email: "", password: "" });
      onTeacherCreated?.();
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Error creating teacher",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl p-6 max-w-lg mx-auto mt-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <UserPlus size={28} className="text-blue-600" />
        <h3 className="text-2xl font-bold text-gray-800">Create New Teacher</h3>
      </div>

      {/* Status Message */}
      <AnimatePresence>
        {status.message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-2 text-sm mb-3 p-2 rounded ${
              status.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle size={18} />
            ) : (
              <XCircle size={18} />
            )}
            {status.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Name */}
        <div className="relative">
          <input
            name="name"
            placeholder="Full Name"
            className="border border-gray-300 rounded-lg p-2 pl-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail
            size={18}
            className="absolute left-3 top-3 text-gray-400 pointer-events-none"
          />
          <input
            name="email"
            placeholder="Teacher Email"
            type="email"
            className="border border-gray-300 rounded-lg p-2 pl-9 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock
            size={18}
            className="absolute left-3 top-3 text-gray-400 pointer-events-none"
          />
          <input
            name="password"
            placeholder="Password"
            type="password"
            className="border border-gray-300 rounded-lg p-2 pl-9 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
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
          className={`w-full py-2 rounded-lg text-white font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow-md"
          }`}
        >
          {loading ? "Creating..." : "Create Teacher"}
        </motion.button>
      </form>
    </motion.div>
  );
}

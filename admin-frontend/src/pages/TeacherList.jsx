import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Trash2, Users } from "lucide-react";
import API from "../api";
import CreateTeacher from "./CreateTeacher";

export default function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(res.data.filter((u) => u.role === "teacher"));
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("🗑️ Are you sure you want to delete this teacher?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(teachers.filter((t) => t._id !== id));
    } catch (err) {
      alert("Failed to delete teacher");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-blue-50 py-12 px-4"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <Users size={32} className="text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-800">
              Teacher Management
            </h2>
          </div>
          <p className="text-gray-500 text-sm">
            Total Teachers:{" "}
            <span className="font-semibold text-blue-700">
              {teachers.length}
            </span>
          </p>
        </div>

        {/* ✅ Create Teacher Section */}
        <CreateTeacher onTeacherCreated={fetchTeachers} />

        {/* ✅ Teacher List */}
        <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl p-6 mt-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading teachers...</p>
          ) : teachers.length === 0 ? (
            <p className="text-center text-gray-500">No teachers found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {teachers.map((t, index) => (
                  <motion.div
                    key={t._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    className="border border-gray-200 bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 shadow hover:shadow-lg transition"
                  >
                    {/* Teacher Info */}
                    <div className="flex items-center gap-3 mb-2">
                      <User
                        size={36}
                        className="text-blue-600 bg-blue-100 p-2 rounded-full"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {t.name}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <Mail size={14} /> {t.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-gray-500 bg-blue-50 px-2 py-1 rounded-full">
                        {t.role}
                      </span>
                      <button
                        onClick={() => handleDelete(t._id)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm font-medium transition"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

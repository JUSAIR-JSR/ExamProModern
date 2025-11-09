import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Trash2, GraduationCap } from "lucide-react";
import API from "../api";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/users");
      setStudents(res.data.filter((u) => u.role === "student"));
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("⚠️ Are you sure you want to delete this student?")) return;
    await API.delete(`/admin/users/${id}`);
    setStudents(students.filter((s) => s._id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-green-50 py-12 px-4"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <GraduationCap size={32} className="text-green-600" />
            <h2 className="text-3xl font-bold text-gray-800">Student Management</h2>
          </div>
          <p className="text-gray-500 text-sm mt-2 sm:mt-0">
            Total Students:{" "}
            <span className="font-semibold text-green-700">{students.length}</span>
          </p>
        </div>

        {/* Content */}
        <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl p-6">
          {loading ? (
            <p className="text-center text-gray-500">Loading students...</p>
          ) : students.length === 0 ? (
            <p className="text-center text-gray-500">No students found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {students.map((s) => (
                  <motion.div
                    key={s._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="relative border border-gray-200 bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 shadow hover:shadow-lg transition"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <User size={36} className="text-green-600 bg-green-100 p-2 rounded-full" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{s.name}</h3>
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <Mail size={14} /> {s.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-gray-500 bg-green-50 px-2 py-1 rounded-full">
                        {s.role}
                      </span>

                      <button
                        onClick={() => handleDelete(s._id)}
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

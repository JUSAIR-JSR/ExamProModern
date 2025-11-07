// admin-frontend/src/pages/TeacherList.jsx
import { useEffect, useState } from "react";
import API from "../api";
import CreateTeacher from "./CreateTeacher";

export default function TeacherList() {
  const [teachers, setTeachers] = useState([]);

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(res.data.filter((u) => u.role === "teacher"));
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this teacher?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Teacher deleted successfully");
      fetchTeachers();
    } catch (err) {
      alert("Failed to delete teacher");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">👩‍🏫 Teacher Management</h2>

      {/* ✅ Create Teacher Form */}
      <CreateTeacher onTeacherCreated={fetchTeachers} />

      {/* ✅ Teacher List Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-3">
                  No teachers found
                </td>
              </tr>
            ) : (
              teachers.map((t, i) => (
                <tr key={t._id} className="border-t hover:bg-gray-50">
                  <td className="border p-2 text-center">{i + 1}</td>
                  <td className="border p-2">{t.name}</td>
                  <td className="border p-2">{t.email}</td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

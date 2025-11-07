import { useEffect, useState } from "react";
import API from "../api";

export default function StudentList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const res = await API.get("/admin/users");
    setStudents(res.data.filter((u) => u.role === "student"));
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this student?")) return;
    await API.delete(`/admin/users/${id}`);
    loadStudents();
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Student List</h2>
      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <ul className="divide-y">
          {students.map((s) => (
            <li key={s._id} className="py-3 flex justify-between">
              <div>
                <p className="font-semibold">{s.name}</p>
                <p className="text-gray-500">{s.email}</p>
              </div>
              <button
                onClick={() => handleDelete(s._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

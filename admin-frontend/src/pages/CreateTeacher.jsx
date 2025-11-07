// admin-frontend/src/pages/CreateTeacher.jsx
import { useState } from "react";
import API from "../api";

export default function CreateTeacher({ onTeacherCreated }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await API.post("/admin/create-teacher", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ " + res.data.message);
      setForm({ name: "", email: "", password: "" });
      onTeacherCreated?.(); // refresh teacher list after creation
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Error creating teacher"));
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-lg font-semibold mb-2">Create New Teacher</h3>
      {message && <p className="text-sm mb-2">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          className="border p-2 w-full mb-2 rounded"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          className="border p-2 w-full mb-2 rounded"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          className="border p-2 w-full mb-2 rounded"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create Teacher
        </button>
      </form>
    </div>
  );
}

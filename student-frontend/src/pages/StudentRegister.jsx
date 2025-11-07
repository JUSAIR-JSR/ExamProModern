import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
      // ✅ Use correct backend route
      const res = await API.post("/auth/register/student", form);

      // ✅ Save token and user info locally
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));

      alert("🎉 Registration successful!");
      navigate("/"); // redirect to student dashboard
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-green-50">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded-xl shadow-md w-96 border border-gray-100"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-green-700">
          Student Registration
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="border p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          } text-white w-full py-2 rounded transition`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="mt-3 text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}

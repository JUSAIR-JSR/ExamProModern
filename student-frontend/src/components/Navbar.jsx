import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  // ✅ Hide navbar on login and registration pages
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  if (hideNavbar) return <></>;

  return (
    <nav className="bg-green-700 text-white p-4 shadow-md flex justify-between items-center">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-bold">🎓 Student Dashboard</h1>
      </div>

      <div className="flex gap-4 items-center">
        <Link to="/" className="hover:underline">
          Exams
        </Link>
        {/* ❌ Removed the Results link */}
        <Link to="/profile" className="hover:underline">
          Profile
        </Link>

        {user && (
          <span className="text-sm italic text-gray-200">
            Hello, {user.name}
          </span>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ShieldCheck, LogIn } from "lucide-react";
import API, { adminGoogleLogin } from "../api";
import { safeStorage } from "../safeStorage";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  // console.log(import.meta.env);

// console.log("Google Client ID =", GOOGLE_CLIENT_ID);

  /* ========================================
      LOAD GOOGLE SCRIPT
  ========================================= */
  useEffect(() => {
    const scriptId = "google-auth";
    if (document.getElementById(scriptId)) return;

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  /* ========================================
      GOOGLE POPUP LOGIN
  ========================================= */
const triggerGooglePopup = () => {
  if (!window.google) {
    alert("Google login not ready yet.");
    return;
  }
  // console.log("GOOGLE_CLIENT_ID =", GOOGLE_CLIENT_ID);
  if (!GOOGLE_CLIENT_ID) {
    alert("Google Client ID missing!");
    return;
  }


  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleLogin,
  });

  window.google.accounts.id.prompt();
};


  /* ========================================
      GOOGLE LOGIN RESPONSE
  ========================================= */
  const handleGoogleLogin = async (response) => {
    try {
      const res = await adminGoogleLogin({ credential: response.credential });

      safeStorage.setItem("token", res.data.token);
      safeStorage.setItem("user", JSON.stringify(res.data));

      navigate("/dashboard", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Google Login Failed");
    }
  };

  /* ========================================
      NORMAL LOGIN
  ========================================= */
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

      navigate("/dashboard", { replace: true });
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

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2"
              required
            />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2"
              required
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            <LogIn size={18} />
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        {/* Custom Google Button */}
        <button
          onClick={triggerGooglePopup}
          className="w-full mt-5 flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 bg-white hover:bg-gray-100 transition"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="text-gray-700 font-medium">
            Sign in with Google
          </span>
        </button>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} ExamPro Admin Panel • Secure Access
        </p>
      </motion.div>
    </div>
  );
}

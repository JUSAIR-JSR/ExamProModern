import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { adminGoogleLogin } from "../api";
import { safeStorage } from "../safeStorage";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const GOOGLE_CLIENT_ID =
    import.meta.env.VITE_GOOGLE_CLIENT_ID || "<YOUR_CLIENT_ID>";

  /* ============================================
       LOAD GOOGLE SCRIPT + RENDER BUTTON
  ============================================ */
  useEffect(() => {
    const scriptId = "google-client-script";

    // Load google script only once
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.id = scriptId;
      script.async = true;
      script.defer = true;

      script.onload = () => renderGoogleButton();
      document.body.appendChild(script);
    } else {
      renderGoogleButton();
    }
  }, []);

  const renderGoogleButton = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
        ux_mode: "popup",
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        {
          theme: "outline",
          size: "large",
          width: "280",
        }
      );
    }
  };

  /* ============================================
        GOOGLE LOGIN RESPONSE HANDLER
  ============================================ */
  const handleGoogleLogin = async (response) => {
    try {
      const res = await adminGoogleLogin({
        credential: response.credential,
      });

      safeStorage.setItem("token", res.data.token);
      safeStorage.setItem("user", JSON.stringify(res.data.admin));

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Google Login Failed");
    }
  };

  /* ============================================
       NORMAL ADMIN LOGIN
  ============================================ */
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", { email, password });

      if (res.data.role !== "admin") {
        return setError("Only admins can log in.");
      }

      safeStorage.setItem("token", res.data.token);
      safeStorage.setItem("user", JSON.stringify(res.data));

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <h2 className="text-3xl font-bold text-center mb-6">Admin Login</h2>

        {error && <p className="text-red-600 text-center mb-3">{error}</p>}

        {/* ================== NORMAL LOGIN ================== */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <div className="text-center my-4 text-gray-500">OR</div>

        {/* GOOGLE BUTTON */}
        <div id="googleSignInDiv" className="flex justify-center"></div>
      </div>
    </div>
  );
}

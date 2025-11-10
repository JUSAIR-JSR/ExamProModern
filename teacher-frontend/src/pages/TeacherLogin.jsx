import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Lock, 
  LogIn, 
  GraduationCap, 
  Eye, 
  EyeOff,
  Loader2,
  Shield,
  UserCheck,
  BookOpen
} from "lucide-react";
import API from "../api";
import { safeStorage } from "../safeStorage";

export default function TeacherLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post("/auth/login", { email, password });
      if (res.data.role !== "teacher") {
        alert("Access denied. Only teachers can log in.");
        return;
      }
      safeStorage.setItem("token", res.data.token);
      safeStorage.setItem("user", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4"
          >
            <GraduationCap className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-lg">
            Sign in to your teacher dashboard
          </p>
        </motion.div>

        {/* Login Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-blue-200/50 p-8 border border-white/60"
        >
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your institutional email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full border ${
                    focusedField === 'email' 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-300'
                  } rounded-xl pl-12 pr-4 py-4 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-400`}
                  required
                />
                <Mail className={`w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                  focusedField === 'email' ? 'text-blue-600' : 'text-gray-400'
                }`} />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full border ${
                    focusedField === 'password' 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-300'
                  } rounded-xl pl-12 pr-12 py-4 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-400`}
                  required
                />
                <Lock className={`w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                  focusedField === 'password' ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            {/* Login Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-4"
            >
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                disabled={loading}
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-blue-200/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-3"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Authenticating...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="ready"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-3"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Sign In to Dashboard</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </form>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">Secure Login</p>
                <p className="text-xs text-blue-600">
                  Your credentials are encrypted and securely transmitted. Only authorized educators can access this portal.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center mt-8"
        >
          <div className="flex items-center justify-center gap-4 text-gray-500 mb-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              <span className="text-sm">Educator Access Only</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">Teaching Portal</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} EduMaster Pro — Teacher Dashboard v2.0
          </p>
        </motion.div>
      </div>
    </div>
  );
}
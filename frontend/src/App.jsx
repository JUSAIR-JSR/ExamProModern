import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import ExamsPage from "./pages/ExamsPage";
import ManageExam from "./pages/ManageExam";
import TakeExam from "./pages/TakeExam";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect, useState } from "react";
import API from "./api";
import { 
  ExamIcon, 
  UserIcon, 
  LogoutIcon, 
  MenuIcon, 
  CloseIcon,
  DashboardIcon 
} from "./components/Icons";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loadMe = async () => {
    setLoading(true);
    try {
      const res = await API.get("/me");
      setUser(res.data.user);
    } catch (err) {
      console.error("Failed to load user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMe();
  }, []);

  const logout = async () => {
    try {
      await API.post("/auth/logout");
      setUser(null);
      navigate("/login");
      setMobileMenuOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Premium Navbar */}
      <nav className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-slate-200/60' 
          : 'bg-transparent'
        }
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                ExamPro
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 transition-colors duration-200 font-medium group"
              >
                <DashboardIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>My Exams</span>
              </Link>
              
              <Link 
                to="/take" 
                className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 transition-colors duration-200 font-medium group"
              >
                <ExamIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Take Exam</span>
              </Link>

              {!loading && !user && (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/login" 
                    className="text-slate-700 hover:text-blue-600 transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-slate-100/50"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {!loading && user && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 bg-slate-100/80 rounded-xl px-4 py-2 border border-slate-200/60">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name?.charAt(0) || "U"}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-800">
                        {user.name || "User"}
                      </span>
                      <span className="text-xs text-slate-500 capitalize">
                        {user.role}
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={logout}
                    className="flex items-center space-x-2 text-slate-600 hover:text-red-600 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50/50"
                    title="Logout"
                  >
                    <LogoutIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100/50 transition-colors duration-200"
            >
              {mobileMenuOpen ? (
                <CloseIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`
          md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-slate-200/60
          transform transition-all duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}
        `}>
          <div className="px-4 py-6 space-y-4">
            <Link 
              to="/" 
              className="flex items-center space-x-3 text-slate-700 hover:text-blue-600 transition-colors duration-200 font-medium p-3 rounded-lg hover:bg-slate-50/50"
            >
              <DashboardIcon className="w-5 h-5" />
              <span>My Exams</span>
            </Link>
            
            <Link 
              to="/take" 
              className="flex items-center space-x-3 text-slate-700 hover:text-blue-600 transition-colors duration-200 font-medium p-3 rounded-lg hover:bg-slate-50/50"
            >
              <ExamIcon className="w-5 h-5" />
              <span>Take Exam</span>
            </Link>

            {!loading && !user && (
              <div className="pt-4 space-y-3 border-t border-slate-200/60">
                <Link 
                  to="/login" 
                  className="block text-slate-700 hover:text-blue-600 transition-colors duration-200 font-medium p-3 rounded-lg hover:bg-slate-50/50 text-center"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl font-medium shadow-lg text-center"
                >
                  Get Started
                </Link>
              </div>
            )}

            {!loading && user && (
              <div className="pt-4 space-y-3 border-t border-slate-200/60">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50/50">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-800">
                      {user.name || "User"}
                    </div>
                    <div className="text-xs text-slate-500 capitalize">
                      {user.role}
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={logout}
                  className="w-full flex items-center justify-center space-x-2 text-red-600 hover:bg-red-50 transition-colors duration-200 p-3 rounded-lg font-medium"
                >
                  <LogoutIcon className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        <Routes>
          <Route path="/" element={<ExamsPage user={user} />} />
          <Route path="/manage/:id" element={<ManageExam user={user} />} />
          <Route path="/take" element={<TakeExam user={user} />} />
          <Route path="/login" element={<Login onLogin={loadMe} />} />
          <Route path="/register" element={<Register onRegister={loadMe} />} />
        </Routes>
      </main>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-slate-600 font-medium">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
}
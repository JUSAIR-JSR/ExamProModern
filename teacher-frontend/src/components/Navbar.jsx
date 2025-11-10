import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  BookOpen,
  PlusCircle,
  Home,
  GraduationCap,
  Menu,
  X,
  User,
  Settings,
  Bell,
  ChevronDown,
  Shield,
  BarChart3
} from "lucide-react";
import { safeStorage } from "../safeStorage";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(safeStorage.getItem("user") || "{}");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    safeStorage.removeItem("token");
    safeStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    { path: "/", icon: Home, label: "Dashboard", color: "text-blue-400" },
    { path: "/add-exam", icon: PlusCircle, label: "Create Exam", color: "text-green-400" },
    { path: "/exams", icon: BookOpen, label: "All Exams", color: "text-purple-400" },
    { path: "/analytics", icon: BarChart3, label: "Analytics", color: "text-amber-400" },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white shadow-2xl border-b border-white/10 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm bg-opacity-95"
    >
      {/* Logo and Title */}
      <motion.div 
        className="flex items-center gap-3"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg"
        >
          <GraduationCap size={28} className="text-white" />
        </motion.div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            EduMaster Pro
          </h1>
          <p className="text-xs text-blue-200 opacity-80">Teacher Dashboard</p>
        </div>
      </motion.div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link
                to={item.path}
                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-200 group relative"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={item.color}
                >
                  <Icon size={18} />
                </motion.div>
                <span className="font-medium text-white/90 group-hover:text-white">
                  {item.label}
                </span>
                <motion.div
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 group-hover:w-full transition-all duration-300"
                  initial={false}
                />
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Desktop User Menu */}
      <div className="hidden lg:flex items-center gap-4">
        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-xl hover:bg-white/10 transition-colors duration-200"
        >
          <Bell size={20} className="text-blue-200" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900"></span>
        </motion.button>

        {/* User Profile */}
        <motion.div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-all duration-200 border border-white/10"
          >
            <motion.div
              className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1 }}
            >
              <User size={16} className="text-white" />
            </motion.div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">
                {user.name || "Teacher"}
              </p>
              <p className="text-xs text-blue-200">Educator</p>
            </div>
            <motion.div
              animate={{ rotate: userMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} className="text-blue-200" />
            </motion.div>
          </motion.button>

          {/* User Dropdown */}
          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 w-64 bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10 py-2 z-50"
              >
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="font-semibold text-white">{user.name || "Teacher"}</p>
                  <p className="text-sm text-blue-200">{user.email || "teacher@school.edu"}</p>
                </div>
                
                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors duration-200 text-left">
                  <User size={16} className="text-blue-400" />
                  <span className="text-white">Profile Settings</span>
                </button>
                
                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors duration-200 text-left">
                  <Settings size={16} className="text-green-400" />
                  <span className="text-white">Preferences</span>
                </button>
                
                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors duration-200 text-left">
                  <Shield size={16} className="text-amber-400" />
                  <span className="text-white">Privacy & Security</span>
                </button>

                <div className="border-t border-white/10 mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors duration-200 text-left"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Mobile Menu Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="lg:hidden bg-white/10 p-2 rounded-xl hover:bg-white/20 transition-colors duration-200 border border-white/10"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <AnimatePresence mode="wait">
          {mobileMenuOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={24} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <Menu size={24} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 right-0 h-full w-80 max-w-full bg-gradient-to-b from-slate-900 to-indigo-900 shadow-2xl border-l border-white/10 z-[100] lg:hidden"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                    <GraduationCap size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white">EduMaster Pro</h2>
                    <p className="text-xs text-blue-200">Teacher Dashboard</p>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{user.name || "Teacher"}</p>
                    <p className="text-sm text-blue-200">Educator</p>
                  </div>
                </div>
              </div>

              {/* Mobile Menu Items */}
              <div className="p-4 space-y-2">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-all duration-200 group"
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className={item.color}
                        >
                          <Icon size={20} />
                        </motion.div>
                        <span className="font-medium text-white/90 group-hover:text-white">
                          {item.label}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Mobile Logout */}
                <motion.button
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200 mt-4"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Sign Out</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
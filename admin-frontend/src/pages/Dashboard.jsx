import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, GraduationCap, BookOpen, Shield } from "lucide-react";

export default function Dashboard() {
  const cards = [
    {
      title: "Teachers",
      icon: <Users size={40} className="text-blue-500" />,
      color: "from-blue-500/90 to-blue-700",
      path: "/teachers",
      emoji: "👩‍🏫",
    },
    {
      title: "Students",
      icon: <GraduationCap size={40} className="text-green-500" />,
      color: "from-green-500/90 to-green-700",
      path: "/students",
      emoji: "🎓",
    },
    {
      title: "Exams",
      icon: <BookOpen size={40} className="text-purple-500" />,
      color: "from-purple-500/90 to-purple-700",
      path: "/exams",
      emoji: "📝",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-blue-50 py-16 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <div className="flex justify-center mb-2">
          <Shield className="text-blue-700" size={42} />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-500">
          Welcome back! Manage your platform efficiently 🚀
        </p>
      </motion.div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={card.path}
              className={`relative block bg-gradient-to-br ${card.color} text-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition duration-300`}
            >
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <motion.div
                  initial={{ rotate: -10, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {card.icon}
                </motion.div>
                <h2 className="text-2xl font-bold tracking-wide">
                  {card.title}
                </h2>
                <span className="text-3xl">{card.emoji}</span>
              </div>

              {/* Shine effect */}
              <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 hover:opacity-30 transition duration-300"></div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-gray-500 text-sm mt-10"
      >
        © {new Date().getFullYear()} ExamPro Admin Panel — Powered by Excellence 💼
      </motion.p>
    </div>
  );
}

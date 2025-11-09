import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";

export default function QuestionCard({ question, index, onSelect }) {
  const [selected, setSelected] = useState(null);

  const handleClick = (i) => {
    const newSel = selected === i ? null : i;
    setSelected(newSel);
    onSelect(question._id, newSel);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/90 backdrop-blur-sm border border-green-100 p-5 rounded-2xl shadow-md hover:shadow-lg transition-all mb-5"
    >
      {/* Question Text */}
      <p className="font-semibold text-gray-800 mb-3 text-lg">
        {index + 1}. {question.text}
      </p>

      {/* Options */}
      <div className="grid sm:grid-cols-2 gap-3">
        {question.options.map((opt, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleClick(i)}
            className={`flex items-center gap-3 border px-3 py-2 rounded-full text-left transition-all ${
              selected === i
                ? "border-green-500 bg-green-50 text-green-800 shadow-sm"
                : "border-gray-300 hover:bg-gray-50 text-gray-700"
            }`}
          >
            <span className="flex items-center justify-center w-5 h-5">
              {selected === i ? (
                <CheckCircle2 className="text-green-600" size={18} />
              ) : (
                <Circle className="text-gray-400" size={18} />
              )}
            </span>
            <span className="text-sm sm:text-base">{opt}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

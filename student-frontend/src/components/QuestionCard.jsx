import { useState } from "react";

export default function QuestionCard({ question, index, onSelect }) {
  const [selected, setSelected] = useState(null);

  const handleClick = (i) => {
    const newSel = selected === i ? null : i;
    setSelected(newSel);
    onSelect(question._id, newSel);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <p className="font-semibold mb-2">{index + 1}. {question.text}</p>
      <div className="grid grid-cols-2 gap-3">
        {question.options.map((opt, i) => (
          <button key={i} onClick={() => handleClick(i)}
            className={`flex items-center border p-2 rounded-full ${
              selected === i
                ? "border-green-500 bg-green-100"
                : "border-gray-300 hover:bg-gray-50"
            }`}>
            <span className="w-5 h-5 border rounded-full mr-2 flex items-center justify-center">
              {selected === i && "●"}
            </span>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

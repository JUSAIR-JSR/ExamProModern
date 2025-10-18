import { useEffect, useState } from "react";
import API from "../api";
import {
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon
} from "./Icons";

export default function QuestionForm({ examId, onAdded, editQuestion, clearEdit }) {
  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState("");
  const [timeLimit, setTimeLimit] = useState(30);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editQuestion) {
      setEditingId(editQuestion._id);
      setText(editQuestion.text);
      setOptions(editQuestion.options || ["", "", "", ""]);
      setCorrect(editQuestion.correct);
      setTimeLimit(editQuestion.timeLimit || 30);
    }
  }, [editQuestion]);

  const reset = () => {
    setText("");
    setOptions(["", "", "", ""]);
    setCorrect("");
    setTimeLimit(30);
    setEditingId(null);
    setIsSubmitting(false);
    if (clearEdit) clearEdit();
  };

  const submit = async () => {
    if (!text.trim()) return alert("Please enter the question text");
    if (options.some((o) => !o.trim())) return alert("Please fill all options");
    if (!correct.trim()) return alert("Please specify the correct answer");

    setIsSubmitting(true);

    const payload = {
      examId,
      text: text.trim(),
      options: options.map((opt) => opt.trim()),
      correct: correct.trim(),
      timeLimit: Number(timeLimit),
    };

    try {
      if (editingId) {
        await API.put(`/questions/${editingId}`, payload);
      } else {
        await API.post("/questions", payload);
      }
      reset();
      if (onAdded) onAdded();
    } catch (error) {
      alert("Failed to save question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      if (correct === options[index]) {
        setCorrect("");
      }
    }
  };

  const updateOption = (index, value) => {
    const arr = [...options];
    arr[index] = value;
    setOptions(arr);
  };

  const isValid = text.trim() && options.every(o => o.trim()) && correct.trim();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
          <DocumentTextIcon className="w-5 h-5" />
          <span>{editingId ? "Edit Question" : "Create New Question"}</span>
        </h3>
        {editingId && (
          <button 
            onClick={reset}
            className="text-slate-400 hover:text-slate-600 transition-colors duration-200 p-2 hover:bg-slate-100 rounded-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Question Text */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Question Text *
        </label>
        <textarea
          rows="3"
          placeholder="Enter your question here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none placeholder-slate-400"
        />
      </div>

      {/* Options Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-slate-700">
            Options *
          </label>
          {options.length < 6 && (
            <button 
              type="button" 
              onClick={addOption}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Option</span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          {options.map((opt, i) => (
            <div key={i} className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-slate-100 border-2 border-slate-200 rounded-lg flex items-center justify-center text-slate-600 font-medium text-sm flex-shrink-0">
                {String.fromCharCode(65 + i)}
              </div>
              <input
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-slate-400"
              />
              {options.length > 2 && (
                <button 
                  type="button" 
                  onClick={() => removeOption(i)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Correct Answer */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Correct Answer *
        </label>
        <div className="relative">
          <select
            value={correct}
            onChange={(e) => setCorrect(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white"
          >
            <option value="">Select correct answer</option>
            {options.map((opt, i) => (
              <option key={i} value={opt} disabled={!opt.trim()}>
                {opt || `Option ${String.fromCharCode(65 + i)}`}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Time Limit */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Time Limit (seconds) *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ClockIcon className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="number"
            min="5"
            max="300"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Set time limit for this question (5-300 seconds)
        </p>
      </div>

      {/* Validation Status */}
      <div className="bg-slate-50 rounded-2xl p-4">
        <h4 className="text-sm font-medium text-slate-700 mb-3">Validation Status</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
              text.trim() ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {text.trim() ? (
                <CheckCircleIcon className="w-3 h-3 text-green-600" />
              ) : (
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
              )}
            </div>
            <span className={`text-sm ${text.trim() ? 'text-green-700' : 'text-red-700'}`}>
              Question text {text.trim() ? "✓" : "required"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
              options.every((o) => o.trim()) ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {options.every((o) => o.trim()) ? (
                <CheckCircleIcon className="w-3 h-3 text-green-600" />
              ) : (
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
              )}
            </div>
            <span className={`text-sm ${options.every((o) => o.trim()) ? 'text-green-700' : 'text-red-700'}`}>
              All options filled {options.every((o) => o.trim()) ? "✓" : "required"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
              correct.trim() ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {correct.trim() ? (
                <CheckCircleIcon className="w-3 h-3 text-green-600" />
              ) : (
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
              )}
            </div>
            <span className={`text-sm ${correct.trim() ? 'text-green-700' : 'text-red-700'}`}>
              Correct answer selected {correct.trim() ? "✓" : "required"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 pt-4">
        <button 
          onClick={submit} 
          disabled={isSubmitting || !isValid}
          className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <CheckCircleIcon className="w-5 h-5" />
          )}
          <span>
            {isSubmitting ? "Saving..." : editingId ? "Save Changes" : "Add Question"}
          </span>
        </button>
        
        <button 
          onClick={reset} 
          disabled={isSubmitting}
          className="px-6 py-4 border-2 border-slate-300 text-slate-700 rounded-2xl font-medium hover:border-slate-400 hover:bg-slate-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear
        </button>
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Quick Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Ensure questions are clear and unambiguous</li>
          <li>• Make sure only one option is definitively correct</li>
          <li>• Consider appropriate time limits based on question complexity</li>
          <li>• Use 2-6 options per question for optimal assessment</li>
        </ul>
      </div>
    </div>
  );
}
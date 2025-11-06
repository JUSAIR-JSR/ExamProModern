import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function ExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // Shuffle questions
  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Fetch exam and questions
  useEffect(() => {
    const fetchExamData = async () => {
      const res = await API.get("/exams");
      const e = res.data.find((x) => x._id === id);
      setExam(e);
      setTimeLeft(e.duration * 60);

      const qRes = await API.get(`/exams/${id}/questions`);
      const randomized = shuffleArray(qRes.data);
      setQuestions(randomized);
    };
    fetchExamData();
  }, [id]);

  // Timer
  useEffect(() => {
    if (submitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted, timeLeft]);

  // Choose/Unchoose
  const handleSelect = (qid, optionIndex) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === qid);
      if (existing) {
        if (existing.selected === optionIndex) {
          return prev.map((a) =>
            a.questionId === qid ? { ...a, selected: null } : a
          );
        }
        return prev.map((a) =>
          a.questionId === qid ? { ...a, selected: optionIndex } : a
        );
      }
      return [...prev, { questionId: qid, selected: optionIndex }];
    });
  };

  const submitExam = async () => {
    const res = await API.post("/responses/submit", {
      examId: id,
      answers,
    });
    setSubmitted(true);
    navigate("/result", { state: { result: res.data } });
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (!exam || questions.length === 0) return <p>Loading...</p>;

  const q = questions[currentIndex];
  const selected =
    answers.find((a) => a.questionId === q._id)?.selected ?? null;

  const getQuestionStatus = (qid) => {
    const ans = answers.find((a) => a.questionId === qid);
    return ans && ans.selected !== null ? "attempted" : "unattempted";
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-5xl mx-auto">
      {/* Sidebar */}
      <div className="md:w-1/4 bg-white p-4 rounded shadow h-fit sticky top-4">
        <h3 className="font-semibold mb-3 text-center">Question Tracker</h3>
        <div className="grid grid-cols-5 gap-2">
          {questions.map((qObj, i) => {
            const status = getQuestionStatus(qObj._id);
            return (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-10 h-10 rounded-full font-semibold ${
                  currentIndex === i
                    ? "ring-2 ring-blue-500"
                    : status === "attempted"
                    ? "bg-green-400 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        <div className="mt-4 text-sm text-gray-600 space-y-1">
          <p>🟩 Attempted</p>
          <p>⚪ Unattempted</p>
          <p>🔵 Current Question</p>
        </div>
      </div>

      {/* Exam Section */}
      <div className="flex-1">
        <div className="flex justify-between mb-4">
          <h1 className="text-xl font-bold">{exam.title}</h1>
          <span className="text-red-600 font-semibold">
            ⏱ {formatTime(timeLeft)}
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          {/* ✅ Optional Image */}
         {/* ✅ Secure Cloudinary image with zoom */}
          {q.image ? (
            <div className="relative max-w-sm overflow-hidden rounded-lg border group mx-auto mb-3">
              <img
                src={q.image}
                alt="question"
                className="transition-transform duration-300 ease-in-out group-hover:scale-150 group-focus:scale-150"
                tabIndex={0}
              />
            </div>
          ) : (
            <p className="text-gray-400 text-sm italic">(No image provided)</p>
          )}


          {/* ✅ Multi-line Question Text */}
          <p className="font-semibold mb-2 whitespace-pre-line">
            Q{currentIndex + 1}. {q.text}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelect(q._id, i)}
                className={`flex items-center border p-2 rounded-full transition-all ${
                  selected === i
                    ? "border-green-600 bg-green-100"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`w-5 h-5 border-2 rounded-full mr-2 flex items-center justify-center ${
                    selected === i
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-gray-400"
                  }`}
                >
                  {selected === i ? "●" : ""}
                </span>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
            disabled={currentIndex === 0}
            className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={submitExam}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Submit Exam
            </button>
          ) : (
            <button
              onClick={() =>
                setCurrentIndex((i) => Math.min(i + 1, questions.length - 1))
              }
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
